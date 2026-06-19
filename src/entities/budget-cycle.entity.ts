import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BudgetSubmission } from './budget-submission.entity';

@Entity('budget_cycles')
export class BudgetCycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fiscalYear: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'date', nullable: true })
  submissionDeadline: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(() => BudgetSubmission, (submission) => submission.budgetCycle)
  submissions: BudgetSubmission[];
}
