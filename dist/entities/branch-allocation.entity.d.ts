import { BudgetSubmission } from './budget-submission.entity';
import { Branch } from './branch.entity';
export declare class BranchAllocation {
    id: number;
    branch: Branch;
    submission: BudgetSubmission;
    allocatedAmount: number;
    createdAt: Date;
}
