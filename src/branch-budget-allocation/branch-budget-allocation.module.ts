import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchBudgetAllocation } from '../entities/branch-budget-allocation.entity';
import { Branch } from '../entities/branch.entity';
import { GlAccount } from '../entities/gl-account.entity';
import { CoreBankingTransaction } from '../entities/core-banking.entity';
import { BranchBudgetAllocationService } from './branch-budget-allocation.service';
import { BranchBudgetAllocationController } from './branch-budget-allocation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BranchBudgetAllocation, Branch, GlAccount, CoreBankingTransaction]),
  ],
  providers: [BranchBudgetAllocationService],
  controllers: [BranchBudgetAllocationController],
  exports: [BranchBudgetAllocationService],
})
export class BranchBudgetAllocationModule {}
