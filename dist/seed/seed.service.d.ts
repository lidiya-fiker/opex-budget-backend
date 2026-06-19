import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { District } from '../entities/district.entity';
import { Branch } from '../entities/branch.entity';
import { User } from '../entities/user.entity';
import { ExpenseCategory } from '../entities/expense-category.entity';
import { Department } from '../entities/department.entity';
import { OpexBudget } from '../entities/opex-budget.entity';
import { CoreBankingTransaction } from '../entities/core-banking.entity';
export declare class SeedService implements OnModuleInit {
    private districtRepo;
    private branchRepo;
    private userRepo;
    private categoryRepo;
    private departmentRepo;
    private opexBudgetRepo;
    private txRepo;
    private readonly logger;
    constructor(districtRepo: Repository<District>, branchRepo: Repository<Branch>, userRepo: Repository<User>, categoryRepo: Repository<ExpenseCategory>, departmentRepo: Repository<Department>, opexBudgetRepo: Repository<OpexBudget>, txRepo: Repository<CoreBankingTransaction>);
    onModuleInit(): Promise<void>;
    seedIfNeeded(): Promise<void>;
    seedLdapIfNeeded(): Promise<void>;
    seedCategories(): Promise<void>;
    seedDistricts(): Promise<void>;
    seedDepartments(): Promise<void>;
}
