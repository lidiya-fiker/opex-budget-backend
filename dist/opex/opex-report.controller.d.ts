import { Repository } from 'typeorm';
import { OpexBudget } from '../entities/opex-budget.entity';
import { CoreBankingTransaction } from '../entities/core-banking.entity';
import { Branch } from '../entities/branch.entity';
import { District } from '../entities/district.entity';
import { Department } from '../entities/department.entity';
import { OpexBudgetService } from './opex.service';
export declare class OpexReportController {
    private readonly budgetService;
    private readonly budgetRepo;
    private readonly transactionRepo;
    private readonly branchRepo;
    private readonly districtRepo;
    private readonly departmentRepo;
    constructor(budgetService: OpexBudgetService, budgetRepo: Repository<OpexBudget>, transactionRepo: Repository<CoreBankingTransaction>, branchRepo: Repository<Branch>, districtRepo: Repository<District>, departmentRepo: Repository<Department>);
    private getActualsForBudget;
    getBvaReport(fiscalYear?: string, level?: 'BANKWIDE' | 'DISTRICT' | 'DEPARTMENT' | 'BRANCH', targetId?: string, monthStr?: string): Promise<any[]>;
    getBranchCategoryReport(fiscalYear?: string, monthStr?: string): Promise<any[]>;
    getExceptionReport(fiscalYear?: string, monthStr?: string): Promise<any[]>;
}
