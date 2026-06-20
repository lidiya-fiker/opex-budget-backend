import { Repository } from 'typeorm';
import { BudgetSubmission, SubmissionStatus } from '../entities/budget-submission.entity';
import { BudgetItem } from '../entities/budget-item.entity';
import { WorkflowAudit } from '../entities/workflow-audit.entity';
import { User } from '../entities/user.entity';
import { Notification } from '../entities/notification.entity';
import { OpexBudget } from '../entities/opex-budget.entity';
export declare class WorkflowService {
    private submissionRepository;
    private budgetItemRepository;
    private auditRepository;
    private userRepository;
    private notificationRepository;
    private opexBudgetRepository;
    constructor(submissionRepository: Repository<BudgetSubmission>, budgetItemRepository: Repository<BudgetItem>, auditRepository: Repository<WorkflowAudit>, userRepository: Repository<User>, notificationRepository: Repository<Notification>, opexBudgetRepository: Repository<OpexBudget>);
    advanceStatus(submissionId: number, user: User, nextStatus: SubmissionStatus, comments?: string): Promise<BudgetSubmission>;
    private sendWorkflowNotifications;
}
