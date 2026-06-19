import { Repository } from 'typeorm';
import { ExpenseCategory } from '../entities/expense-category.entity';
export declare class ExpenseCategoryController {
    private readonly categoryRepo;
    constructor(categoryRepo: Repository<ExpenseCategory>);
    findAll(): Promise<ExpenseCategory[]>;
    createOrUpdate(data: any): Promise<ExpenseCategory | ExpenseCategory[] | null>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
