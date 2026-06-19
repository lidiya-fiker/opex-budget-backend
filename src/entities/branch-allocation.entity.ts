import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BudgetSubmission } from './budget-submission.entity';
import { Branch } from './branch.entity';

@Entity('branch_allocation')
export class BranchAllocation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.id, { eager: true })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => BudgetSubmission, (sub) => sub.id, { eager: true })
  @JoinColumn({ name: 'submission_id' })
  submission: BudgetSubmission;

  @Column({ type: 'bigint' })
  allocatedAmount: number; // final approved amount (ETB)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
