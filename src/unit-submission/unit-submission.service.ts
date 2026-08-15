import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitSubmissionStatus } from '../entities/unit-submission-status.entity';

@Injectable()
export class UnitSubmissionService {
  constructor(
    @InjectRepository(UnitSubmissionStatus)
    private readonly repo: Repository<UnitSubmissionStatus>,
  ) {}

  async getStatus(budgetCycleId: number) {
    const all = await this.repo.find({ where: { budgetCycleId } });
    const submitted = all.filter((u) => u.submitted);
    const notSubmitted = all.filter((u) => !u.submitted);
    return { submitted, notSubmitted, total: all.length };
  }

  async markSubmitted(unitId: number, budgetCycleId: number): Promise<UnitSubmissionStatus> {
    let record = await this.repo.findOne({ where: { unitId, budgetCycleId } });
    if (!record) {
      record = this.repo.create({ unitId, budgetCycleId });
    }
    record.submitted = true;
    record.submissionDate = new Date();
    return this.repo.save(record);
  }

  async syncUnits(units: Partial<UnitSubmissionStatus>[]): Promise<void> {
    // Upsert all units for a given cycle (called by admin/BCC at cycle start)
    for (const unit of units) {
      const existing = await this.repo.findOne({
        where: { unitId: unit.unitId, budgetCycleId: unit.budgetCycleId },
      });
      if (!existing) {
        await this.repo.save(this.repo.create(unit));
      }
    }
  }
}
