import { BudgetSubmission } from './budget-submission.entity';
import { District } from './district.entity';
export declare class Branch {
    id: number;
    code: string;
    name: string;
    district: District;
    submissions: BudgetSubmission[];
}
