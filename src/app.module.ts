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
// ── New feature entities ──────────────────────────────────────────────────────
import { ManualPayment } from './entities/manual-payment.entity';
import { ApprovalMatrix } from './entities/approval-matrix.entity';
import { ContractRegister } from './entities/contract-register.entity';
import { AssociatedExpenseRule } from './entities/associated-expense-rule.entity';
import { LockedLineItem } from './entities/locked-line-item.entity';
import { CapexBusinessCase } from './entities/capex-business-case.entity';
import { OutlierDefinition } from './entities/outlier-definition.entity';
import { UnitSubmissionStatus } from './entities/unit-submission-status.entity';
import { BranchMisMapping } from './entities/branch-mis-mapping.entity';
import { BulkAdjustment } from './entities/bulk-adjustment.entity';
import { GlAccount } from './entities/gl-account.entity';
import { BranchBudgetAllocation } from './entities/branch-budget-allocation.entity';
import { AlertThreshold } from './entities/alert-threshold.entity';
// ── New feature modules ───────────────────────────────────────────────────────
import { ManualPaymentModule } from './manual-payment/manual-payment.module';
import { ContractRegisterModule } from './contract-register/contract-register.module';
import { AssociatedExpenseModule } from './associated-expense/associated-expense.module';
import { CapexModule } from './capex/capex.module';
import { OutlierModule } from './outlier/outlier.module';
import { UnitSubmissionModule } from './unit-submission/unit-submission.module';
import { BranchMisModule } from './branch-mis/branch-mis.module';
import { BulkAdjustmentModule } from './bulk-adjustment/bulk-adjustment.module';
import { ReportingModule } from './reporting/reporting.module';
import { LockedLineItemModule } from './locked-line-item/locked-line-item.module';
import { ApprovalMatrixModule } from './approval-matrix/approval-matrix.module';
import { EmailModule } from './email/email.module';
import { BulkUploadModule } from './bulk-upload/bulk-upload.module';
import { FutureModule } from './future/future.module';
import { GlAccountModule } from './gl-account/gl-account.module';
import { BranchMasterModule } from './branch-master/branch-master.module';
import { BranchBudgetAllocationModule } from './branch-budget-allocation/branch-budget-allocation.module';
import { CbsAdapterModule } from './cbs-adapter/cbs-adapter.module';
import { AlertThresholdModule } from './alert-threshold/alert-threshold.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
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
      // new entities
      ManualPayment,
      ApprovalMatrix,
      ContractRegister,
      AssociatedExpenseRule,
      LockedLineItem,
      CapexBusinessCase,
      OutlierDefinition,
      UnitSubmissionStatus,
      BranchMisMapping,
      BulkAdjustment,
      GlAccount,
      BranchBudgetAllocation,
      AlertThreshold,
    ]),
    AuthModule,
    WorkflowModule,
    MockGlModule,
    SeedModule,
    AdminModule,
    OpexModule,
    // new feature modules
    ManualPaymentModule,
    ContractRegisterModule,
    AssociatedExpenseModule,
    CapexModule,
    OutlierModule,
    UnitSubmissionModule,
    BranchMisModule,
    BulkAdjustmentModule,
    ReportingModule,
    LockedLineItemModule,
    ApprovalMatrixModule,
    EmailModule,
    BulkUploadModule,
    FutureModule,
    GlAccountModule,
    BranchMasterModule,
    BranchBudgetAllocationModule,
    CbsAdapterModule,
    AlertThresholdModule,
  ],
  controllers: [AppController, BudgetCycleController, BudgetSubmissionController, ExpenseCategoryController, DistrictController, NotificationController],
  providers: [AppService],
})
export class AppModule {}
