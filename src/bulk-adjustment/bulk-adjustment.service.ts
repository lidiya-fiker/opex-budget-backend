import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BulkAdjustment } from '../entities/bulk-adjustment.entity';
import { OpexBudget } from '../entities/opex-budget.entity';

@Injectable()
export class BulkAdjustmentService {
  constructor(
    @InjectRepository(BulkAdjustment)
    private readonly adjustmentRepo: Repository<BulkAdjustment>,
    @InjectRepository(OpexBudget)
    private readonly opexRepo: Repository<OpexBudget>,
  ) {}

  /**
   * Apply a percentage reduction to all selected GL accounts in a budget cycle.
   * targetGlCodes: array of GL codes to apply to (empty = apply to all in cycle).
   */
  async applyReduction(
    budgetCycleId: number,
    percentage: number,
    targetGlCodes: string[],
    appliedBy: number,
  ): Promise<{ updated: number }> {
    const qb = this.opexRepo
      .createQueryBuilder('ob')
      .where('ob.budgetCycleId = :cycleId', { cycleId: budgetCycleId });

    if (targetGlCodes && targetGlCodes.length) {
      qb.andWhere('ob.glCode IN (:...codes)', { codes: targetGlCodes });
    }

    const budgets = await qb.getMany();
    const factor = 1 - percentage;

    for (const b of budgets) {
      b.annualAmount = Number((Number(b.annualAmount) * factor).toFixed(2));
    }
    await this.opexRepo.save(budgets);

    // Record the adjustment log
    await this.adjustmentRepo.save(
      this.adjustmentRepo.create({
        budgetCycleId,
        adjustmentType: 'PERCENTAGE_REDUCTION',
        targetArea: targetGlCodes,
        percentage,
        appliedBy,
      }),
    );

    return { updated: budgets.length };
  }

  async findAll(): Promise<BulkAdjustment[]> {
    return this.adjustmentRepo.find({ order: { appliedAt: 'DESC' } });
  }
}
