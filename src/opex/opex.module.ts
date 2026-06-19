import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpexBudget } from '../entities/opex-budget.entity';
import { OpexBudgetAudit } from '../entities/opex-budget-audit.entity';
import { OpexTransferRequest } from '../entities/opex-transfer-request.entity';
import { OpexUtilizationRequest } from '../entities/opex-utilization-request.entity';
import { CoreBankingTransaction, CoreBankingLog } from '../entities/core-banking.entity';
import { OpexAlert } from '../entities/opex-alert.entity';
import { Department } from '../entities/department.entity';
import { Branch } from '../entities/branch.entity';
import { District } from '../entities/district.entity';
import { User } from '../entities/user.entity';
import { Notification } from '../entities/notification.entity';

import { OpexBudgetService } from './opex.service';
import { CoreBankingService } from './core-banking.service';

import { OpexBudgetController } from './opex-budget.controller';
import { OpexTransferController } from './opex-transfer.controller';
import { OpexUtilizationController } from './opex-utilization.controller';
import { CoreBankingController } from './core-banking.controller';
import { OpexReportController } from './opex-report.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OpexBudget,
      OpexBudgetAudit,
      OpexTransferRequest,
      OpexUtilizationRequest,
      CoreBankingTransaction,
      CoreBankingLog,
      OpexAlert,
      Department,
      Branch,
      District,
      User,
      Notification,
    ]),
  ],
  providers: [OpexBudgetService, CoreBankingService],
  controllers: [
    OpexBudgetController,
    OpexTransferController,
    OpexUtilizationController,
    CoreBankingController,
    OpexReportController,
  ],
  exports: [OpexBudgetService, CoreBankingService],
})
export class OpexModule {}
