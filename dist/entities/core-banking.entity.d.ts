import { OpexBudget } from './opex-budget.entity';
import { BranchBudgetAllocation } from './branch-budget-allocation.entity';
export declare class CoreBankingTransaction {
    id: number;
    referenceNumber: string;
    transactionDate: Date;
    valueDate: Date | null;
    glNumber: string;
    costCenterCode: string;
    bankingType: 'CONVENTIONAL' | 'IFB';
    amount: number;
    description: string;
    isMapped: boolean;
    status: 'UNMAPPED' | 'MAPPED' | 'IGNORED' | 'DUPLICATE';
    rawPayload: string | null;
    mappedBudget: OpexBudget | null;
    mappedAllocation: BranchBudgetAllocation | null;
    createdAt: Date;
}
export declare class CoreBankingLog {
    id: number;
    runTime: Date;
    status: 'SUCCESS' | 'FAILED';
    recordsExtracted: number;
    errorMessage: string | null;
}
