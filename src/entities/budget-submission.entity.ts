import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Branch } from './branch.entity';
import { BudgetCycle } from './budget-cycle.entity';
import { BudgetItem } from './budget-item.entity';
import { WorkflowAudit } from './workflow-audit.entity';

export enum SubmissionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED_TO_BRANCH_MANAGER = 'SUBMITTED_TO_BRANCH_MANAGER',
  BRANCH_APPROVED = 'BRANCH_APPROVED',
  DISTRICT_REVIEWED = 'DISTRICT_REVIEWED',
  DISTRICT_APPROVED = 'DISTRICT_APPROVED',
  BCC_APPROVED = 'BCC_APPROVED',
  STRATEGY_APPROVED = 'STRATEGY_APPROVED',
  EXECUTIVE_APPROVED = 'EXECUTIVE_APPROVED',
  BOARD_APPROVED = 'BOARD_APPROVED',
  RETURNED = 'RETURNED',
  RETURNED_TO_DISTRICT = 'RETURNED_TO_DISTRICT',
  EXCLUDED = 'EXCLUDED',
}

@Entity('budget_submissions')
export class BudgetSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.submissions)
  branch: Branch;

  @ManyToOne(() => BudgetCycle, (cycle) => cycle.submissions)
  budgetCycle: BudgetCycle;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ default: 'ETB' })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 1 })
  exchangeRate: number;

  @Column({ type: 'varchar', default: SubmissionStatus.DRAFT })
  status: SubmissionStatus;

  @OneToMany(() => BudgetItem, (item) => item.submission, { cascade: true })
  items: BudgetItem[];

  @OneToMany(() => WorkflowAudit, (audit) => audit.submission)
  audits: WorkflowAudit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
