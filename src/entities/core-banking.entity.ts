import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { OpexBudget } from './opex-budget.entity';
import { BranchBudgetAllocation } from './branch-budget-allocation.entity';

@Entity('core_banking_transactions')
export class CoreBankingTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: true })
  referenceNumber: string;

  @Column({ type: 'timestamp' })
  transactionDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  valueDate: Date | null;

  @Column()
  glNumber: string;

  @Column()
  costCenterCode: string; // branch code or department code

  @Column({ type: 'varchar', default: 'CONVENTIONAL' })
  bankingType: 'CONVENTIONAL' | 'IFB';

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({ default: false })
  isMapped: boolean;

  @Column({ type: 'varchar', default: 'UNMAPPED' })
  status: 'UNMAPPED' | 'MAPPED' | 'IGNORED' | 'DUPLICATE';

  @Column({ type: 'text', nullable: true })
  rawPayload: string | null;

  @ManyToOne(() => OpexBudget, { nullable: true, eager: true })
  mappedBudget: OpexBudget | null;

  @ManyToOne(() => BranchBudgetAllocation, { nullable: true, eager: true })
  mappedAllocation: BranchBudgetAllocation | null;

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
