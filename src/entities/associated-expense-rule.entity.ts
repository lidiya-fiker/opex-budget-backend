import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('associated_expense_rules')
export class AssociatedExpenseRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'main_account_code' })
  mainAccountCode: string; // e.g. 'BASIC_SALARY'

  @Column({ name: 'linked_account_code' })
  linkedAccountCode: string; // e.g. 'PENSION'

  @Column({ name: 'percentage', type: 'numeric', precision: 6, scale: 4 })
  percentage: number; // e.g. 0.11 for 11%

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
