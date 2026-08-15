import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('alert_thresholds')
export class AlertThreshold {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: 'BANKWIDE' })
  level: 'BANKWIDE' | 'DISTRICT' | 'BRANCH' | 'GL';

  @Column({ type: 'varchar', nullable: true })
  targetCode: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100.00 })
  overUtilizationPct: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 90.00 })
  warningPct: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 40.00 })
  underUtilizationPct: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
