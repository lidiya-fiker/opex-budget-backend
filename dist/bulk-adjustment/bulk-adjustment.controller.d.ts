import { BulkAdjustmentService } from './bulk-adjustment.service';
export declare class BulkAdjustmentController {
    private readonly service;
    constructor(service: BulkAdjustmentService);
    findAll(): Promise<import("../entities/bulk-adjustment.entity").BulkAdjustment[]>;
    apply(body: {
        budgetCycleId: number;
        percentage: number;
        targetGlCodes: string[];
        appliedBy: number;
    }): Promise<{
        updated: number;
    }>;
}
