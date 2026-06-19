import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { OpexBudget } from './opex-budget.entity';

@Entity('core_banking_transactions')
export class CoreBankingTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  transactionDate: Date;

  @Column()
  glNumber: string;

  @Column()
  costCenterCode: string; // branch code or department code

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({ default: false })
  isMapped: boolean;

  @ManyToOne(() => OpexBudget, { nullable: true, eager: true })
  mappedBudget: OpexBudget | null;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('core_banking_logs')
export class CoreBankingLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  runTime: Date;

  @Column({ type: 'varchar' })
  status: 'SUCCESS' | 'FAILED';

  @Column({ default: 0 })
  recordsExtracted: number;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;
}
