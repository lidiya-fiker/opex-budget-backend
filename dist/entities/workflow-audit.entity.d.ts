import { BudgetSubmission, SubmissionStatus } from './budget-submission.entity';
import { User } from './user.entity';
export declare class WorkflowAudit {
    id: number;
    submission: BudgetSubmission;
    actionBy: User;
    actionDate: Date;
    fromStatus: SubmissionStatus;
    toStatus: SubmissionStatus;
    comments: string;
}
