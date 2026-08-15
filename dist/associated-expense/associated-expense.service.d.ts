import { Repository } from 'typeorm';
import { AssociatedExpenseRule } from '../entities/associated-expense-rule.entity';
export declare class AssociatedExpenseService {
    private readonly repo;
    constructor(repo: Repository<AssociatedExpenseRule>);
    findAll(): Promise<AssociatedExpenseRule[]>;
    create(data: Partial<AssociatedExpenseRule>): Promise<AssociatedExpenseRule>;
    calculate(mainAccountCode: string, budgetAmount: number): Promise<{
        linkedAccountCode: string;
        calculatedAmount: number;
    }[]>;
}
