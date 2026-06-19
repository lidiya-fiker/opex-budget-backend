import { Repository } from 'typeorm';
import { BudgetCycle } from '../entities/budget-cycle.entity';
import { Branch } from '../entities/branch.entity';
import { ExpenseCategory } from '../entities/expense-category.entity';
import { BudgetSubmission } from '../entities/budget-submission.entity';
import { BudgetItem } from '../entities/budget-item.entity';
import { User } from '../entities/user.entity';
import { Notification } from '../entities/notification.entity';
export declare class BudgetCycleController {
    private readonly cycleRepo;
    private readonly branchRepo;
    private readonly categoryRepo;
    private readonly submissionRepo;
    private readonly itemRepo;
    private readonly userRepo;
    private readonly notificationRepo;
    constructor(cycleRepo: Repository<BudgetCycle>, branchRepo: Repository<Branch>, categoryRepo: Repository<ExpenseCategory>, submissionRepo: Repository<BudgetSubmission>, itemRepo: Repository<BudgetItem>, userRepo: Repository<User>, notificationRepo: Repository<Notification>);
    findAll(): Promise<BudgetCycle[]>;
    findOne(id: number): Promise<BudgetCycle | null>;
    create(cycleData: Partial<BudgetCycle>): Promise<BudgetCycle>;
    update(id: number, data: Partial<BudgetCycle>): Promise<BudgetCycle | null>;
    publish(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
