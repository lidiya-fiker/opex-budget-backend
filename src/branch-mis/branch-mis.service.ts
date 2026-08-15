import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchMisMapping } from '../entities/branch-mis-mapping.entity';

@Injectable()
export class BranchMisService {
  constructor(
    @InjectRepository(BranchMisMapping)
    private readonly repo: Repository<BranchMisMapping>,
  ) {}

  async findAll(): Promise<BranchMisMapping[]> {
    return this.repo.find({ order: { branchCode: 'ASC' } });
  }

  async findActive(): Promise<BranchMisMapping[]> {
    return this.repo.find({ where: { isActive: true } });
  }

  async findClosed(): Promise<BranchMisMapping[]> {
    return this.repo.find({ where: { isActive: false } });
  }

  async upsert(data: Partial<BranchMisMapping>): Promise<BranchMisMapping> {
    const existing = await this.repo.findOne({ where: { branchCode: data.branchCode } });
    if (existing) {
      Object.assign(existing, data);
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create(data));
  }

  async closeUnit(branchCode: string): Promise<BranchMisMapping> {
    const unit = await this.repo.findOne({ where: { branchCode } });
    if (!unit) throw new Error(`Unit ${branchCode} not found`);
    unit.isActive = false;
    unit.closedAt = new Date();
    return this.repo.save(unit);
  }

  async resolveCode(misCodeOrBranchCode: string): Promise<string> {
    const mapping = await this.repo.findOne({
      where: [
        { branchCode: misCodeOrBranchCode },
        { misCode: misCodeOrBranchCode }
      ]
    });
    return mapping ? mapping.branchCode : misCodeOrBranchCode;
  }

  async findMapping(misCodeOrBranchCode: string): Promise<BranchMisMapping | null> {
    return this.repo.findOne({
      where: [
        { branchCode: misCodeOrBranchCode },
        { misCode: misCodeOrBranchCode }
      ]
    });
  }
}
