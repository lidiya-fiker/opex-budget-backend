import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Branch } from './branch.entity';
import { GlAccount } from './gl-account.entity';
import { BudgetCycle } from './budget-cycle.entity';

@Entity('branch_budget_allocations')
export class BranchBudgetAllocation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => GlAccount, { eager: true, nullable: true })
  @JoinColumn({ name: 'gl_account_id' })
  glAccount: GlAccount | null;

  @Column()
  glCode: string;

  @Column()
  glDescription: string;

  @ManyToOne(() => BudgetCycle, { eager: true, nullable: true })
  @JoinColumn({ name: 'budget_cycle_id' })
  budgetCycle: BudgetCycle | null;

  @Column()
  fiscalYear: string; // e.g. '2025/26' (baseline) or '2026/27' (current)

  @Column({ type: 'varchar', default: 'CONVENTIONAL' })
  bankingType: 'CONVENTIONAL' | 'IFB';

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  allocatedAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualAmount: number;

  // Monthly breakdowns
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m1: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m2: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m3: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m4: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m5: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m6: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m7: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m8: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m9: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m10: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m11: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) m12: number;

  @Column({ default: false })
  isBaseline: boolean;

  @Column({ type: 'varchar', default: 'APPROVED' })
  status: 'APPROVED' | 'PENDING' | 'LOCKED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
