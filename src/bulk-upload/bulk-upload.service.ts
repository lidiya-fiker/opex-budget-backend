import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { OpexBudget } from '../entities/opex-budget.entity';
import { Branch } from '../entities/branch.entity';
import { District } from '../entities/district.entity';
import { User, Role } from '../entities/user.entity';
import * as XLSX from 'xlsx';
import * as bcrypt from 'bcryptjs';

export type UploadType = 'conventional' | 'ifb' | 'supplementary';

@Injectable()
export class BulkUploadService {
  private readonly logger = new Logger(BulkUploadService.name);

  constructor(
    @InjectRepository(OpexBudget)
    private readonly opexRepo: Repository<OpexBudget>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Parse uploaded Excel / CSV buffer and upsert budget line items.
   * Expected columns: glNumber, glDescription, expenseCategory,
   *                   fiscalYear, level, annualAmount, m1..m12
   */
  async processUpload(
    buffer: Buffer,
    uploadType: UploadType,
    uploadedBy: number,
    budgetCycleId?: number,
  ): Promise<{ inserted: number; updated: number; errors: string[] }> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

    if (!rows.length) throw new BadRequestException('Uploaded file is empty');

    const REQUIRED = ['glNumber', 'glDescription', 'fiscalYear', 'annualAmount'];
    const missing = REQUIRED.filter((k) => !(k in rows[0]));
    if (missing.length) {
      throw new BadRequestException(`Missing required columns: ${missing.join(', ')}`);
    }

    let inserted = 0;
    let updated = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const existing = await this.opexRepo.findOne({
          where: { glNumber: row.glNumber, fiscalYear: row.fiscalYear },
        });

        const data: Partial<OpexBudget> = {
          glNumber: row.glNumber,
          glDescription: row.glDescription,
          expenseCategory: row.expenseCategory || (uploadType === 'ifb' ? 'IFB' : 'CONVENTIONAL'),
          fiscalYear: row.fiscalYear,
          level: row.level || 'BRANCH',
          annualAmount: Number(row.annualAmount),
          m1: Number(row.m1 || 0),
          m2: Number(row.m2 || 0),
          m3: Number(row.m3 || 0),
          m4: Number(row.m4 || 0),
          m5: Number(row.m5 || 0),
          m6: Number(row.m6 || 0),
          m7: Number(row.m7 || 0),
          m8: Number(row.m8 || 0),
          m9: Number(row.m9 || 0),
          m10: Number(row.m10 || 0),
          m11: Number(row.m11 || 0),
          m12: Number(row.m12 || 0),
          status: uploadType === 'supplementary' ? 'PENDING' : 'PENDING',
        };

        if (existing) {
          await this.opexRepo.update(existing.id, data);
          updated++;
        } else {
          await this.opexRepo.save(this.opexRepo.create(data));
          inserted++;
        }
      } catch (err) {
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    return { inserted, updated, errors };
  }

  /**
   * Parse the specific pivoted format where:
   * Col 0 = Line Item / Expense
   * Col 1 = District Approved Budget
   * Col 2 = District Total Actual (M12)
   * Col 3..N = Branches Auto-Allocated Budget
   * Col (N+1)..(2N) = Branches Actual Utilization
   */
  async processDistrictPivotedUpload(
    buffer: Buffer,
    uploadedBy: number,
    districtName: string,
    fiscalYear: string,
  ): Promise<{ inserted: number; updated: number; errors: string[] }> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    if (rawData.length < 3) throw new BadRequestException('Uploaded file does not have enough rows');

    let topHeadersRowIdx = -1;
    let subHeadersRowIdx = -1;

    for (let i = 0; i < Math.min(20, rawData.length); i++) {
      const rowStr = rawData[i].map(x => String(x || '').toUpperCase()).join(',');
      if (rowStr.includes('ACTUAL UTILIZATION') || rowStr.includes('BUDGET INPUTS')) topHeadersRowIdx = i;
      if (rowStr.includes('LINE ITEM')) {
        subHeadersRowIdx = i;
        break;
      }
    }

    if (subHeadersRowIdx === -1) throw new BadRequestException('Could not find LINE ITEM header row in Excel file');
    
    const topHeaders = topHeadersRowIdx !== -1 ? rawData[topHeadersRowIdx] : [];
    const subHeaders = rawData[subHeadersRowIdx];

    // --- AUTO-CREATE OR RESOLVE DISTRICT ---
    let district = await this.districtRepo.findOne({ where: { name: districtName } });
    if (!district) {
      district = await this.districtRepo.save(this.districtRepo.create({
        name: districtName,
        code: 'DIST_' + districtName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10),
      }));
      
      const username = districtName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.district';
      const pwHash = await bcrypt.hash('Password@123', 10);
      await this.userRepo.save(this.userRepo.create({
        email: `${username}@dashen.com`,
        displayName: `${districtName} Manager`,
        passwordHash: pwHash,
        role: Role.DISTRICT_MANAGER,
        district: district,
      }));
    }

    const branches = await this.branchRepo.find({ where: { district: { id: district.id } } });
    const branchMap = new Map<string, Branch>();
    branches.forEach(b => {
      branchMap.set(b.code.toUpperCase().trim(), b);
      branchMap.set(b.name.toLowerCase().replace(/branch/g, '').trim(), b);
    });

    let districtBudgetCol = -1;
    let districtActualCol = -1;
    const branchBudgetCols: { colIndex: number; branch: Branch }[] = [];
    const branchActualCols: { colIndex: number; branch: Branch }[] = [];

    const pwHashBranch = await bcrypt.hash('Password@123', 10);

    for (let c = 0; c < subHeaders.length; c++) {
      const topH = topHeaders[c] ? String(topHeaders[c]).toUpperCase() : '';
      const subH = subHeaders[c] ? String(subHeaders[c]).trim() : '';
      const combinedH = `${topH} ${subH.toUpperCase()}`;

      if (combinedH.includes('DISTRICT APPROVED')) districtBudgetCol = c;
      if (combinedH.includes('DISTRICT TOTAL ACTUAL')) districtActualCol = c;

      // Check for branch code in brackets e.g. "ADAMA ARADA BRANCH [053] Actual (M12)"
      const codeMatch = subH.match(/\[([A-Za-z0-9_]+)\]/);
      const branchCode = codeMatch ? codeMatch[1].trim() : null;

      // Extract branch clean name
      const nameMatch = subH.match(/^([A-Za-z0-9\s]+?)(?=\[|\d{2,}|ALLOCATED|ACTUAL|BRANCH|TOTAL|DISTRICT|\s*$)/i);
      const cleanBranchName = nameMatch ? nameMatch[1].replace(/branch/gi, '').trim() : subH.split('[')[0].trim();

      if (cleanBranchName && cleanBranchName.length > 1 && !cleanBranchName.toUpperCase().includes('DISTRICT') && !cleanBranchName.toUpperCase().includes('TOTAL')) {
        let branch: Branch | null = null;
        if (branchCode) branch = branchMap.get(branchCode.toUpperCase()) || null;
        if (!branch) branch = branchMap.get(cleanBranchName.toLowerCase()) || null;

        // Auto-create branch if missing
        if (!branch) {
          const newBranchCode = branchCode || 'BR_' + cleanBranchName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
          branch = await this.branchRepo.save(this.branchRepo.create({
            name: `${cleanBranchName} Branch`,
            code: newBranchCode,
            district,
          }));
          branchMap.set(newBranchCode.toUpperCase(), branch);
          branchMap.set(cleanBranchName.toLowerCase(), branch);

          const baseUser = cleanBranchName.toLowerCase().replace(/[^a-z0-9]/g, '');
          await this.userRepo.save(this.userRepo.create({
            email: `${baseUser}.manager@dashen.com`,
            displayName: `${cleanBranchName} Branch Manager`,
            passwordHash: pwHashBranch,
            role: Role.BRANCH_MANAGER,
            branch,
          }));
        }

        if (subH.toUpperCase().includes('ACTUAL') || topH.includes('ACTUAL UTILIZATION')) {
          branchActualCols.push({ colIndex: c, branch });
        } else if (subH.toUpperCase().includes('ALLOCATED') || topH.includes('AUTO-ALLOCATED')) {
          branchBudgetCols.push({ colIndex: c, branch });
        }
      }
    }

    if (districtBudgetCol === -1) districtBudgetCol = 1;
    if (districtActualCol === -1) districtActualCol = 2;

    let inserted = 0;
    let updated = 0;
    const errors: string[] = [];

    // Process data rows
    for (let r = subHeadersRowIdx + 1; r < rawData.length; r++) {
      const row = rawData[r];
      if (!row || row.length === 0) continue;

      const lineItem = row[0] ? String(row[0]).trim() : '';
      if (!lineItem || lineItem.startsWith('A.') || lineItem.startsWith('B.') || lineItem.startsWith('C.')) continue;

      const distBudget = Number(row[districtBudgetCol]) || 0;
      const distActual = Number(row[districtActualCol]) || 0;

      await this.upsertBudgetRow(
        lineItem,
        fiscalYear,
        'DISTRICT',
        distBudget,
        distActual,
        district.id,
        null,
      ).then(res => {
        if (res === 'inserted') inserted++;
        if (res === 'updated') updated++;
      }).catch(err => errors.push(`Row ${r+1} District: ${err.message}`));

      // Process Branch Budgets & Actuals
      for (const col of branchBudgetCols) {
        const branchBudget = Number(row[col.colIndex]) || 0;
        const actualCol = branchActualCols.find(bc => bc.branch.id === col.branch.id);
        const branchActual = actualCol ? (Number(row[actualCol.colIndex]) || 0) : 0;

        await this.upsertBudgetRow(
          lineItem,
          fiscalYear,
          'BRANCH',
          branchBudget,
          branchActual,
          district.id,
          col.branch.id,
        ).then(res => {
          if (res === 'inserted') inserted++;
          if (res === 'updated') updated++;
        }).catch(err => errors.push(`Row ${r+1} Branch ${col.branch.id}: ${err.message}`));
      }
    }

    return { inserted, updated, errors };
  }

  private async upsertBudgetRow(
    lineItem: string,
    fiscalYear: string,
    level: 'DISTRICT' | 'BRANCH',
    annualAmount: number,
    actualAmount: number,
    districtId: number,
    branchId: number | null,
  ): Promise<'inserted' | 'updated'> {
    // Basic match on glDescription for now since GL Number isn't explicitly separated
    const existing = await this.opexRepo.findOne({
      where: {
        glDescription: lineItem,
        fiscalYear,
        level,
        district: { id: districtId },
        branch: branchId ? { id: branchId } : IsNull(),
      } as any,
      relations: ['district', 'branch']
    });

    const data: Partial<OpexBudget> = {
      glNumber: 'N/A', // Auto-generated or matched later
      glDescription: lineItem,
      expenseCategory: 'CONVENTIONAL',
      fiscalYear,
      level,
      annualAmount,
      actualAmount,
      district: { id: districtId } as any,
      ...(branchId ? { branch: { id: branchId } as any } : {}),
      status: 'PENDING',
    };

    if (existing) {
      await this.opexRepo.update(existing.id, { annualAmount, actualAmount });
      return 'updated';
    } else {
      await this.opexRepo.save(this.opexRepo.create(data));
      return 'inserted';
    }
  }
}
