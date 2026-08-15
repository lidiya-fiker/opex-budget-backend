import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreBankingTransaction, CoreBankingLog } from '../entities/core-banking.entity';
import { BranchBudgetAllocation } from '../entities/branch-budget-allocation.entity';
import { OpexBudget } from '../entities/opex-budget.entity';
import { Branch } from '../entities/branch.entity';
import { GlAccount } from '../entities/gl-account.entity';
import { OpexAlert } from '../entities/opex-alert.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { CbsAdapterService } from './cbs-adapter.service';
import { CbsAdapterController } from './cbs-adapter.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CoreBankingTransaction,
      CoreBankingLog,
      BranchBudgetAllocation,
      OpexBudget,
      Branch,
      GlAccount,
      OpexAlert,
      Notification,
      User,
    ]),
  ],
  providers: [CbsAdapterService],
  controllers: [CbsAdapterController],
  exports: [CbsAdapterService],
})
export class CbsAdapterModule {}
