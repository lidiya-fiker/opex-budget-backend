import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { OpexBudget } from './opex-budget.entity';
import { User } from './user.entity';

@Entity('opex_budget_audits')
export class OpexBudgetAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OpexBudget, { onDelete: 'CASCADE' })
  opexBudget: OpexBudget;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  previousAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  newAmount: number;

  @Column({ type: 'text', nullable: true })
  previousAllocations: string | null; // JSON representation of monthly budget allocations

  @Column({ type: 'text', nullable: true })
  newAllocations: string | null; // JSON representation of monthly budget allocations

  @Column()
  modificationType: 'MANUAL_EDIT' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'SUPPLEMENTARY';

  @ManyToOne(() => User, { eager: true })
  modifiedBy: User;

  @CreateDateColumn()
  modifiedAt: Date;
}
