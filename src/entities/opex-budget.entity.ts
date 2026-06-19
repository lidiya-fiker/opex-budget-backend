import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Branch } from './branch.entity';
import { District } from './district.entity';
import { Department } from './department.entity';
import { User } from './user.entity';

@Entity('opex_budgets')
export class OpexBudget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fiscalYear: string; // e.g. '2026/27'

  @Column({ type: 'varchar' })
  level: 'BANKWIDE' | 'DISTRICT' | 'DEPARTMENT' | 'BRANCH';

  @Column()
  glNumber: string;

  @Column()
  glDescription: string;

  @Column()
  expenseCategory: string; // e.g. 'Salaries & Benefits'

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  annualAmount: number;

  // Monthly allocations
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m1: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m2: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m3: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m4: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m5: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m6: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m7: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m8: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m9: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m10: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m11: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  m12: number;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: 'PENDING' | 'APPROVED' | 'RETURNED' | 'REJECTED';

  @Column({ type: 'text', nullable: true })
  remark: string | null;

  @ManyToOne(() => Branch, { nullable: true, eager: true })
  branch: Branch | null;

  @ManyToOne(() => District, { nullable: true, eager: true })
  district: District | null;

  @ManyToOne(() => Department, { nullable: true, eager: true })
  department: Department | null;

  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
