import { Repository } from 'typeorm';
import { BudgetSubmission, SubmissionStatus } from '../entities/budget-submission.entity';
import { BudgetItem } from '../entities/budget-item.entity';
import { Branch } from '../entities/branch.entity';
import { BudgetCycle } from '../entities/budget-cycle.entity';
import { ExpenseCategory } from '../entities/expense-category.entity';
import { WorkflowService } from '../workflow/workflow.service';
export declare class BudgetSubmissionController {
    private readonly submissionRepo;
    private readonly itemRepo;
    private readonly branchRepo;
    private readonly cycleRepo;
    private readonly categoryRepo;
    private readonly workflowService;
    constructor(submissionRepo: Repository<BudgetSubmission>, itemRepo: Repository<BudgetItem>, branchRepo: Repository<Branch>, cycleRepo: Repository<BudgetCycle>, categoryRepo: Repository<ExpenseCategory>, workflowService: WorkflowService);
    findAll(req: any): Promise<BudgetSubmission[]>;
    getDistrictBranches(req: any): Promise<Branch[]>;
    findOne(id: number): Promise<BudgetSubmission | null>;
    create(data: any, req: any): Promise<BudgetSubmission>;
    updateStatus(id: number, newStatus: SubmissionStatus, comments: string, itemsData: any[], req: any): Promise<BudgetSubmission>;
    excludeBranch(branchId: number, cycleId: number, req: any): Promise<BudgetSubmission>;
    districtBulkApprove(cycleId: number, req: any): Promise<{
        message: string;
    }>;
    bccDistrictBulkAction(districtId: number, cycleId: number, action: 'approve' | 'return', comments: string, req: any): Promise<{
        message: string;
    }>;
    districtReapprove(id: number, action: 'reapprove' | 'return_to_branch', comments: string, req: any): Promise<BudgetSubmission>;
    excludeDistrict(districtId: number, cycleId: number, req: any): Promise<{
        message: string;
    }>;
    bccBulkSubmitToStrategy(cycleId: number, comments: string, req: any): Promise<{
        message: string;
    }>;
    bankBulkAction(cycleId: number, action: 'approve' | 'return', comments: string, req: any): Promise<{
        message: string;
    }>;
}
