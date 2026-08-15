import { Repository } from 'typeorm';
import { BulkAdjustment } from '../entities/bulk-adjustment.entity';
import { OpexBudget } from '../entities/opex-budget.entity';
export declare class BulkAdjustmentService {
    private readonly adjustmentRepo;
    private readonly opexRepo;
    constructor(adjustmentRepo: Repository<BulkAdjustment>, opexRepo: Repository<OpexBudget>);
    applyReduction(budgetCycleId: number, percentage: number, targetGlCodes: string[], appliedBy: number): Promise<{
        updated: number;
    }>;
    findAll(): Promise<BulkAdjustment[]>;
}
