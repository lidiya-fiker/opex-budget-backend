import { Branch } from './branch.entity';
import { BudgetCycle } from './budget-cycle.entity';
import { BudgetItem } from './budget-item.entity';
import { WorkflowAudit } from './workflow-audit.entity';
export declare enum SubmissionStatus {
    DRAFT = "DRAFT",
    SUBMITTED_TO_BRANCH_MANAGER = "SUBMITTED_TO_BRANCH_MANAGER",
    BRANCH_APPROVED = "BRANCH_APPROVED",
    DISTRICT_REVIEWED = "DISTRICT_REVIEWED",
    DISTRICT_APPROVED = "DISTRICT_APPROVED",
    BCC_APPROVED = "BCC_APPROVED",
    STRATEGY_APPROVED = "STRATEGY_APPROVED",
    EXECUTIVE_APPROVED = "EXECUTIVE_APPROVED",
    BOARD_APPROVED = "BOARD_APPROVED",
    RETURNED = "RETURNED",
    RETURNED_TO_DISTRICT = "RETURNED_TO_DISTRICT",
    EXCLUDED = "EXCLUDED"
}
export declare class BudgetSubmission {
    id: number;
    branch: Branch;
    budgetCycle: BudgetCycle;
    totalAmount: number;
    currency: string;
    exchangeRate: number;
    status: SubmissionStatus;
    items: BudgetItem[];
    audits: WorkflowAudit[];
    createdAt: Date;
    updatedAt: Date;
}
