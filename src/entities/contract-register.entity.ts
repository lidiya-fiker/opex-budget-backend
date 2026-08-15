import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('contract_register')
export class ContractRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'contract_type' })
  contractType: string; // 'AMC' | 'LICENSE' | 'CAPEX'

  @Column({ name: 'vendor_name' })
  vendorName: string;

  @Column({ name: 'budget_code', nullable: true })
  budgetCode: string;

  @Column({ name: 'vendor_contact', nullable: true })
  vendorContact: string;

  @Column({ name: 'period_start', type: 'date' })
  periodStart: Date;

  @Column({ name: 'period_end', type: 'date' })
  periodEnd: Date;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: number;

  @Column({ length: 10 })
  currency: string; // e.g. 'ETB', 'USD'

  @Column({ default: 'ACTIVE' })
  status: string; // 'ACTIVE' | 'EXPIRED' | 'CANCELLED'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
