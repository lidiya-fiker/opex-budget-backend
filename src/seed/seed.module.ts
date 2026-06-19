import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { District } from '../entities/district.entity';
import { Branch } from '../entities/branch.entity';
import { User } from '../entities/user.entity';
import { ExpenseCategory } from '../entities/expense-category.entity';import { Department } from '../entities/department.entity';
import { OpexBudget } from '../entities/opex-budget.entity';
import { CoreBankingTransaction } from '../entities/core-banking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([District, Branch, User, ExpenseCategory, Department, OpexBudget, CoreBankingTransaction])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
