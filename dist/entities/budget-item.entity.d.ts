import { BudgetSubmission } from './budget-submission.entity';
import { ExpenseCategory } from './expense-category.entity';
export declare class BudgetItem {
    id: number;
    submission: BudgetSubmission;
    category: ExpenseCategory;
    historicalAmount: number;
    requestedAmount: number;
    requestedQ1: number;
    requestedQ2: number;
    requestedQ3: number;
    requestedQ4: number;
    approvedAmount: number;
    approvedQ1: number;
    approvedQ2: number;
    approvedQ3: number;
    approvedQ4: number;
    currency: string;
    exchangeRate: number;
    justification: string;
}
