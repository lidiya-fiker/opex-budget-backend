import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { OpexBudget } from './opex-budget.entity';
import { User } from './user.entity';

@Entity('opex_utilization_requests')
export class OpexUtilizationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OpexBudget, { eager: true })
  opexBudget: OpexBudget;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: 'PENDING' | 'APPROVED' | 'RETURNED' | 'REJECTED';

  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  resolvedBy: User | null;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  returnRemark: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
