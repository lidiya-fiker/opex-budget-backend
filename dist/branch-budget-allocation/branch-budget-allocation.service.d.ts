import { Repository } from 'typeorm';
import { BranchBudgetAllocation } from '../entities/branch-budget-allocation.entity';
import { Branch } from '../entities/branch.entity';
import { GlAccount } from '../entities/gl-account.entity';
import { CoreBankingTransaction } from '../entities/core-banking.entity';
export declare class BranchBudgetAllocationService {
    private readonly allocRepo;
    private readonly branchRepo;
    private readonly glRepo;
    private readonly txRepo;
    private readonly logger;
    constructor(allocRepo: Repository<BranchBudgetAllocation>, branchRepo: Repository<Branch>, glRepo: Repository<GlAccount>, txRepo: Repository<CoreBankingTransaction>);
    findAll(filters: {
        fiscalYear?: string;
        branchCode?: string;
        districtId?: number;
        bankingType?: 'CONVENTIONAL' | 'IFB';
        isBaseline?: boolean;
    }): Promise<BranchBudgetAllocation[]>;
    computeBudgetVsActual(filters: {
        fiscalYear: string;
        baselineYear?: string;
        districtId?: number;
        branchId?: number;
        bankingType?: 'CONVENTIONAL' | 'IFB';
        glCode?: string;
    }): Promise<any[]>;
    processBudgetAllocationImport(buffer: Buffer, fiscalYear: string, isBaseline: boolean, bankingTypeDefault?: 'CONVENTIONAL' | 'IFB'): Promise<{
        inserted: number;
        updated: number;
        errors: string[];
    }>;
}
