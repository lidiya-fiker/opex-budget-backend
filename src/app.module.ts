import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DistrictController } from './district/district.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { WorkflowModule } from './workflow/workflow.module';
import { MockGlModule } from './mock-gl/mock-gl.module';
import { Branch } from './entities/branch.entity';
import { District } from './entities/district.entity';
import { User } from './entities/user.entity';
import { ExpenseCategory } from './entities/expense-category.entity';
import { BudgetCycle } from './entities/budget-cycle.entity';
import { BudgetSubmission } from './entities/budget-submission.entity';
import { BudgetItem } from './entities/budget-item.entity';
import { WorkflowAudit } from './entities/workflow-audit.entity';
import { BudgetCycleController } from './controllers/budget-cycle.controller';
import { BudgetSubmissionController } from './controllers/budget-submission.controller';
import { ExpenseCategoryController } from './controllers/expense-category.controller';
import { NotificationController } from './controllers/notification.controller';
import { SeedModule } from './seed/seed.module';
import { AdminModule } from './admin/admin.module';
import { Notification } from './entities/notification.entity';
import { Department } from './entities/department.entity';
import { OpexBudget } from './entities/opex-budget.entity';
import { OpexBudgetAudit } from './entities/opex-budget-audit.entity';
import { OpexTransferRequest } from './entities/opex-transfer-request.entity';
import { OpexUtilizationRequest } from './entities/opex-utilization-request.entity';
import { CoreBankingTransaction, CoreBankingLog } from './entities/core-banking.entity';
import { OpexAlert } from './entities/opex-alert.entity';
import { OpexModule } from './opex/opex.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    TypeOrmModule.forFeature([
      Branch,
      District,
      User,
      ExpenseCategory,
      BudgetCycle,
      BudgetSubmission,
      BudgetItem,
      WorkflowAudit,
      Notification,
      Department,
      OpexBudget,
      OpexBudgetAudit,
      OpexTransferRequest,
      OpexUtilizationRequest,
      CoreBankingTransaction,
      CoreBankingLog,
      OpexAlert,
    ]),
    AuthModule,
    WorkflowModule,
    MockGlModule,
    SeedModule,
    AdminModule,
    OpexModule,
  ],
  controllers: [AppController, BudgetCycleController, BudgetSubmissionController, ExpenseCategoryController, DistrictController, NotificationController],
  providers: [AppService],
})
export class AppModule {}
