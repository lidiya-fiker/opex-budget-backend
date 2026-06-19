import { OpexBudget } from './opex-budget.entity';
export declare class CoreBankingTransaction {
    id: number;
    transactionDate: Date;
    glNumber: string;
    costCenterCode: string;
    amount: number;
    description: string;
    isMapped: boolean;
    mappedBudget: OpexBudget | null;
    createdAt: Date;
}
export declare class CoreBankingLog {
    id: number;
    runTime: Date;
    status: 'SUCCESS' | 'FAILED';
    recordsExtracted: number;
    errorMessage: string | null;
}
