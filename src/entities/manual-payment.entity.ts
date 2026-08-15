import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ManualPaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
}

@Entity('manual_payments')
export class ManualPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'requester_id' })
  requesterId: number; // FK to User

  @Column({ name: 'budget_code' })
  budgetCode: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ManualPaymentStatus, default: ManualPaymentStatus.PENDING })
  status: ManualPaymentStatus;

  @Column({ type: 'varchar', nullable: true, default: 'OTHER' })
  paymentType: string; // 'CAPEX' | 'AMC' | 'PROFESSIONAL_SERVICES' | 'OTHER'

  @Column({ name: 'confirmation_token', nullable: true, type: 'varchar', length: 64 })
  confirmationToken: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
