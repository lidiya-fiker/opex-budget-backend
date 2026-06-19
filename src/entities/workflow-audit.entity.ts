import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { BudgetSubmission, SubmissionStatus } from './budget-submission.entity';
import { User } from './user.entity';

@Entity('workflow_audits')
export class WorkflowAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BudgetSubmission, (submission) => submission.audits, { onDelete: 'CASCADE' })
  submission: BudgetSubmission;

  @ManyToOne(() => User)
  actionBy: User;

  @CreateDateColumn()
  actionDate: Date;

  @Column({ type: 'varchar', nullable: true })
  fromStatus: SubmissionStatus;

  @Column({ type: 'varchar' })
  toStatus: SubmissionStatus;

  @Column({ type: 'text', nullable: true })
  comments: string;
}
