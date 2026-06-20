import { OpexBudget } from './opex-budget.entity';
import { User } from './user.entity';
export declare class OpexBudgetAudit {
    id: number;
    opexBudget: OpexBudget;
    previousAmount: number;
    newAmount: number;
    previousAllocations: string | null;
    newAllocations: string | null;
    modificationType: 'INITIAL_LOAD' | 'MANUAL_EDIT' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'SUPPLEMENTARY';
    modifiedBy: User;
    modifiedAt: Date;
}
