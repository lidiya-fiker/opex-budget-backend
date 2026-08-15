import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../entities/branch.entity';
import { District } from '../entities/district.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class BranchMasterService {
  private readonly logger = new Logger(BranchMasterService.name);

  constructor(
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
  ) {}

  async findAll(filters: { districtName?: string; region?: string; bankingType?: string; search?: string; isClosed?: boolean }) {
    const qb = this.branchRepo.createQueryBuilder('b')
      .leftJoinAndSelect('b.district', 'district')
      .leftJoinAndSelect('b.department', 'department');

    if (filters.districtName) {
      qb.andWhere('district.name = :districtName', { districtName: filters.districtName });
    }
    if (filters.region) {
      qb.andWhere('(b.region = :region OR district.region = :region)', { region: filters.region });
    }
    if (filters.bankingType) {
      qb.andWhere('b.bankingType = :bt', { bt: filters.bankingType });
    }
    if (filters.isClosed !== undefined) {
      qb.andWhere('b.isClosed = :ic', { ic: filters.isClosed });
    }
    if (filters.search) {
      qb.andWhere('(b.name LIKE :s OR b.code LIKE :s OR b.city LIKE :s OR b.area LIKE :s)', { s: `%${filters.search}%` });
    }

    qb.orderBy('b.name', 'ASC');
    return qb.getMany();
  }

  async findByCode(code: string): Promise<Branch | null> {
    return this.branchRepo.findOne({
      where: { code },
      relations: ['district', 'department'],
    });
  }

  async processBranchMasterImport(buffer: Buffer): Promise<{ inserted: number; updated: number; errors: string[] }> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

    if (!rows.length) throw new BadRequestException('Uploaded branch master file is empty');

    let inserted = 0;
    let updated = 0;
    const errors: string[] = [];

    // District cache map
    const districtCache = new Map<string, District>();
    const existingDistricts = await this.districtRepo.find();
    existingDistricts.forEach((d) => districtCache.set(d.name.toLowerCase().trim(), d));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const branchCode = String(row['Branch Code'] || row['code'] || row['BranchCode'] || row['Code'] || '').trim();
        const branchName = String(row['Branch Name'] || row['name'] || row['BranchName'] || row['Branch'] || '').trim();
        const districtName = String(row['District'] || row['district'] || row['DistrictName'] || 'Main District').trim();
        const area = row['Area'] || row['area'] || null;
        const region = row['Region'] || row['region'] || null;
        const zone = row['Zone'] || row['zone'] || null;
        const city = row['City'] || row['city'] || null;
        const phoneNumber = row['Phone Number'] || row['Phone'] || row['phoneNumber'] || null;
        const bankingTypeRaw = String(row['Banking Type'] || row['bankingType'] || 'CONVENTIONAL').toUpperCase().trim();
        const bankingType = bankingTypeRaw.includes('IFB') ? 'IFB' : bankingTypeRaw.includes('HYBRID') ? 'HYBRID' : 'CONVENTIONAL';

        if (!branchCode || !branchName) {
          errors.push(`Row ${i + 2}: Missing Branch Code or Branch Name`);
          continue;
        }

        // Auto-resolve or create District
        const normDistName = districtName.toLowerCase().trim();
        let district = districtCache.get(normDistName);
        if (!district) {
          district = this.districtRepo.create({
            name: districtName,
            code: 'DIST_' + districtName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10),
            region: region || null,
          });
          district = await this.districtRepo.save(district);
          districtCache.set(normDistName, district);
        }

        const existingBranch = await this.branchRepo.findOne({ where: { code: branchCode } });
        if (existingBranch) {
          existingBranch.name = branchName;
          existingBranch.district = district;
          existingBranch.area = area;
          existingBranch.region = region;
          existingBranch.zone = zone;
          existingBranch.city = city;
          existingBranch.phoneNumber = phoneNumber;
          existingBranch.bankingType = bankingType as any;
          await this.branchRepo.save(existingBranch);
          updated++;
        } else {
          const newBranch = this.branchRepo.create({
            code: branchCode,
            name: branchName,
            district,
            area,
            region,
            zone,
            city,
            phoneNumber,
            bankingType: bankingType as any,
            isClosed: false,
          });
          await this.branchRepo.save(newBranch);
          inserted++;
        }
      } catch (err) {
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    return { inserted, updated, errors };
  }

  async closeBranch(code: string, isClosed = true): Promise<Branch> {
    const branch = await this.branchRepo.findOne({ where: { code } });
    if (!branch) throw new BadRequestException(`Branch ${code} not found`);
    branch.isClosed = isClosed;
    return this.branchRepo.save(branch);
  }
}
