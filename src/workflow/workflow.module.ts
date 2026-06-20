import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowService } from './workflow.service';
import { CascadeService } from './cascade.service';
import { BudgetSubmission } from '../entities/budget-submission.entity';
import { BudgetItem } from '../entities/budget-item.entity';
import { WorkflowAudit } from '../entities/workflow-audit.entity';
import { User } from '../entities/user.entity';
import { Notification } from '../entities/notification.entity';
import { OpexBudget } from '../entities/opex-budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetSubmission, BudgetItem, WorkflowAudit, User, Notification, OpexBudget])],
  providers: [WorkflowService, CascadeService],
  exports: [WorkflowService, CascadeService],
})
export class WorkflowModule {}

