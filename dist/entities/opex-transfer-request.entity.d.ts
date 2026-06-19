import { OpexBudget } from './opex-budget.entity';
import { User } from './user.entity';
export declare class OpexTransferRequest {
    id: number;
    fiscalYear: string;
    requestType: 'TRANSFER' | 'SUPPLEMENTARY';
    fromBudget: OpexBudget | null;
    toBudget: OpexBudget;
    amount: number;
    remark: string;
    status: 'PENDING' | 'APPROVED' | 'RETURNED' | 'REJECTED';
    createdBy: User;
    resolvedBy: User | null;
    resolvedAt: Date | null;
    returnRemark: string | null;
    createdAt: Date;
}
