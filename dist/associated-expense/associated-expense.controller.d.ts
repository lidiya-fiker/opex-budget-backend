import { AssociatedExpenseService } from './associated-expense.service';
import { AssociatedExpenseRule } from '../entities/associated-expense-rule.entity';
export declare class AssociatedExpenseController {
    private readonly service;
    constructor(service: AssociatedExpenseService);
    findAll(): Promise<AssociatedExpenseRule[]>;
    create(body: Partial<AssociatedExpenseRule>): Promise<AssociatedExpenseRule>;
    calculate(accountCode: string, amount: number): Promise<{
        linkedAccountCode: string;
        calculatedAmount: number;
    }[]>;
}
