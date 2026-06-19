import { OpexBudget } from './opex-budget.entity';
import { User } from './user.entity';
export declare class OpexUtilizationRequest {
    id: number;
    opexBudget: OpexBudget;
    amount: number;
    description: string;
    status: 'PENDING' | 'APPROVED' | 'RETURNED' | 'REJECTED';
    createdBy: User;
    resolvedBy: User | null;
    resolvedAt: Date | null;
    returnRemark: string | null;
    createdAt: Date;
}
