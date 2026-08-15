import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreBankingTransaction, CoreBankingLog } from '../entities/core-banking.entity';
import { BranchBudgetAllocation } from '../entities/branch-budget-allocation.entity';
import { OpexBudget } from '../entities/opex-budget.entity';
import { Branch } from '../entities/branch.entity';
import { GlAccount } from '../entities/gl-account.entity';
import { OpexAlert } from '../entities/opex-alert.entity';
import { Notification } from '../entities/notification.entity';
import { User, Role } from '../entities/user.entity';

export interface CbsTransactionInput {
  referenceNumber?: string;
  transactionDate: string | Date;
  valueDate?: string | Date;
  costCenterCode: string; // Branch Code or Department Code
  glCode: string;
  bankingType?: 'CONVENTIONAL' | 'IFB';
  amount: number;
  description: string;
}

@Injectable()
export class CbsAdapterService {
  private readonly logger = new Logger(CbsAdapterService.name);

  constructor(
    @InjectRepository(CoreBankingTransaction)
    private readonly txRepo: Repository<CoreBankingTransaction>,
    @InjectRepository(CoreBankingLog)
    private readonly logRepo: Repository<CoreBankingLog>,
    @InjectRepository(BranchBudgetAllocation)
    private readonly allocRepo: Repository<BranchBudgetAllocation>,
    @InjectRepository(OpexBudget)
    private readonly opexRepo: Repository<OpexBudget>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(GlAccount)
    private readonly glRepo: Repository<GlAccount>,
    @InjectRepository(OpexAlert)
    private readonly alertRepo: Repository<OpexAlert>,
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async processIncomingTransactions(
    inputs: CbsTransactionInput[],
  ): Promise<{ processed: number; mapped: number; unmapped: number; duplicates: number }> {
    const startTime = new Date();
    let mapped = 0;
    let unmapped = 0;
    let duplicates = 0;

    for (const input of inputs) {
      const refNum = input.referenceNumber || `CBS_REF_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      // Deduplication check
      const existingTx = await this.txRepo.findOne({ where: { referenceNumber: refNum } });
      if (existingTx) {
        duplicates++;
        continue;
      }

      const bankingType = input.bankingType || 'CONVENTIONAL';
      const txDate = new Date(input.transactionDate);
      const valDate = input.valueDate ? new Date(input.valueDate) : txDate;

      // Find matching Branch
      const branch = await this.branchRepo.findOne({ where: { code: input.costCenterCode } });

      // Check if closed branch
      if (branch && branch.isClosed) {
        const closedTx = this.txRepo.create({
          referenceNumber: refNum,
          transactionDate: txDate,
          valueDate: valDate,
          costCenterCode: input.costCenterCode,
          glNumber: input.glCode,
          bankingType,
          amount: input.amount,
          description: `${input.description} [WARNING: CLOSED BRANCH ${branch.name}]`,
          isMapped: false,
          status: 'UNMAPPED',
          rawPayload: JSON.stringify(input),
        });
        await this.txRepo.save(closedTx);
        unmapped++;
        await this.notifyAdmins(`⚠️ CBS Transaction received for CLOSED Branch ${branch.name} (${branch.code}). Amount: ${input.amount} ETB.`);
        continue;
      }

      // Try matching BranchBudgetAllocation
      const allocation = await this.allocRepo.findOne({
        where: {
          branch: { code: input.costCenterCode },
          glCode: input.glCode,
          bankingType,
          isBaseline: false,
        },
      });

      // Try matching OpexBudget
      const opexBudget = await this.opexRepo.findOne({
        where: {
          glNumber: input.glCode,
          status: 'APPROVED',
        },
      });

      const isMapped = !!(allocation || opexBudget);

      const tx = this.txRepo.create({
        referenceNumber: refNum,
        transactionDate: txDate,
        valueDate: valDate,
        costCenterCode: input.costCenterCode,
        glNumber: input.glCode,
        bankingType,
        amount: input.amount,
        description: input.description,
        isMapped,
        status: isMapped ? 'MAPPED' : 'UNMAPPED',
        mappedAllocation: allocation || null,
        mappedBudget: opexBudget || null,
        rawPayload: JSON.stringify(input),
      });

      const savedTx = await this.txRepo.save(tx);

      if (allocation) {
        allocation.actualAmount = Number(allocation.actualAmount || 0) + Number(input.amount);
        await this.allocRepo.save(allocation);
        mapped++;
      } else if (opexBudget) {
        opexBudget.actualAmount = Number(opexBudget.actualAmount || 0) + Number(input.amount);
        await this.opexRepo.save(opexBudget);
        mapped++;
      } else {
        unmapped++;
      }
    }

    const log = this.logRepo.create({
      runTime: startTime,
      status: 'SUCCESS',
      recordsExtracted: inputs.length,
    });
    await this.logRepo.save(log);

    return { processed: inputs.length, mapped, unmapped, duplicates };
  }

  async getUnmappedTransactions() {
    return this.txRepo.find({
      where: { status: 'UNMAPPED' },
      order: { transactionDate: 'DESC' },
    });
  }

  async manualMapTransaction(txId: number, allocationId?: number, opexBudgetId?: number) {
    const tx = await this.txRepo.findOne({ where: { id: txId } });
    if (!tx) throw new BadRequestException(`Transaction ${txId} not found`);

    if (allocationId) {
      const alloc = await this.allocRepo.findOne({ where: { id: allocationId } });
      if (!alloc) throw new BadRequestException(`Allocation ${allocationId} not found`);
      alloc.actualAmount = Number(alloc.actualAmount || 0) + Number(tx.amount);
      await this.allocRepo.save(alloc);
      tx.mappedAllocation = alloc;
    }

    if (opexBudgetId) {
      const opex = await this.opexRepo.findOne({ where: { id: opexBudgetId } });
      if (!opex) throw new BadRequestException(`OPEX Budget ${opexBudgetId} not found`);
      opex.actualAmount = Number(opex.actualAmount || 0) + Number(tx.amount);
      await this.opexRepo.save(opex);
      tx.mappedBudget = opex;
    }

    tx.isMapped = true;
    tx.status = 'MAPPED';
    return this.txRepo.save(tx);
  }

  async processTemplateUpload(buffer: Buffer): Promise<{ processed: number; mapped: number; unmapped: number; duplicates: number; errors: string[] }> {
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

    if (!rows.length) throw new BadRequestException('Uploaded CBS template file is empty');

    const inputs: CbsTransactionInput[] = [];
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const costCenterCode = String(
          row['Code(branch code or MIS code)'] ||
          row['Code'] ||
          row['branch code'] ||
          row['MIS code'] ||
          row['costCenterCode'] ||
          row['Branch Code'] ||
          '',
        ).trim();

        const glCode = String(
          row['GL ACCOUNT'] ||
          row['GL Account'] ||
          row['glCode'] ||
          row['GL'] ||
          '',
        ).trim();

        const glDescription = String(
          row['GL DISCRIPTION'] ||
          row['GL Description'] ||
          row['description'] ||
          'CBS Expense Posting',
        ).trim();

        const txDateRaw = row['Transaction date'] || row['Transaction Date'] || row['Date'] || new Date();
        const txDate = txDateRaw ? new Date(txDateRaw) : new Date();

        const amount = Number(
          row['Amount/montly'] ||
          row['Amount'] ||
          row['amount'] ||
          0,
        );

        const bankTypeRaw = String(
          row['Bank type'] ||
          row['Banking Type'] ||
          row['bankingType'] ||
          'Conv',
        ).toUpperCase().trim();

        const bankingType: 'CONVENTIONAL' | 'IFB' = bankTypeRaw.includes('IFB') ? 'IFB' : 'CONVENTIONAL';
        const refNum = `CBS_FILE_${i + 1}_${costCenterCode}_${glCode}_${Date.now()}`;

        if (!costCenterCode || !glCode) {
          errors.push(`Row ${i + 2}: Missing Cost Center Code or GL Account`);
          continue;
        }

        inputs.push({
          referenceNumber: refNum,
          transactionDate: txDate,
          costCenterCode,
          glCode,
          bankingType,
          amount,
          description: glDescription,
        });
      } catch (err) {
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    const result = await this.processIncomingTransactions(inputs);
    return {
      ...result,
      errors,
    };
  }

  private async notifyAdmins(message: string) {
    const admins = await this.userRepo.find({ where: { role: Role.ADMIN } });
    const bccs = await this.userRepo.find({ where: { role: Role.BCC_TEAM } });
    for (const u of [...admins, ...bccs]) {
      const notif = this.notifRepo.create({
        user: u,
        message,
        isRead: false,
      });
      await this.notifRepo.save(notif);
    }
  }
}
