import { BranchBudgetAllocationService } from './branch-budget-allocation.service';
export declare class BranchBudgetAllocationController {
    private readonly allocService;
    constructor(allocService: BranchBudgetAllocationService);
    getAllocations(fiscalYear?: string, branchCode?: string, districtId?: string, bankingType?: 'CONVENTIONAL' | 'IFB', isBaseline?: string): Promise<import("../entities/branch-budget-allocation.entity").BranchBudgetAllocation[]>;
    getBudgetVsActual(fiscalYear: string, baselineYear?: string, districtId?: string, branchId?: string, bankingType?: 'CONVENTIONAL' | 'IFB', glCode?: string): Promise<any[]>;
    importAllocations(file: Express.Multer.File, fiscalYear: string, isBaseline: string, bankingType?: 'CONVENTIONAL' | 'IFB'): Promise<{
        inserted: number;
        updated: number;
        errors: string[];
    }>;
}
