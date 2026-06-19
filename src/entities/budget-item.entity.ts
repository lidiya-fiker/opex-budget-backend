import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BudgetSubmission } from './budget-submission.entity';
import { ExpenseCategory } from './expense-category.entity';

@Entity('budget_items')
export class BudgetItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BudgetSubmission, (submission) => submission.items, { onDelete: 'CASCADE' })
  submission: BudgetSubmission;

  @ManyToOne(() => ExpenseCategory)
  category: ExpenseCategory;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  historicalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  requestedAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  requestedQ1: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  requestedQ2: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  requestedQ3: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  requestedQ4: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  approvedAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  approvedQ1: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  approvedQ2: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  approvedQ3: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  approvedQ4: number;

  @Column({ default: 'ETB' })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 1 })
  exchangeRate: number;

  @Column({ type: 'text', nullable: true })
  justification: string;
}
