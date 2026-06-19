import { BudgetSubmission } from './budget-submission.entity';
export declare class BudgetCycle {
    id: number;
    fiscalYear: string;
    startDate: string;
    endDate: string;
    submissionDeadline: string;
    isActive: boolean;
    isPublished: boolean;
    submissions: BudgetSubmission[];
}
