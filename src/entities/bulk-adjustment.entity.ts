import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('bulk_adjustments')
export class BulkAdjustment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'budget_cycle_id' })
  budgetCycleId: number;

  @Column({ name: 'adjustment_type' })
  adjustmentType: string; // 'PERCENTAGE_REDUCTION' | 'PERCENTAGE_INCREASE'

  @Column({ name: 'target_area', type: 'jsonb', nullable: true })
  targetArea: string[]; // GL codes or areas selected for adjustment

  @Column({ name: 'percentage', type: 'numeric', precision: 6, scale: 4 })
  percentage: number; // e.g. 0.10 for 10% reduction

  @Column({ name: 'applied_by' })
  appliedBy: number; // user id

  @CreateDateColumn({ name: 'applied_at' })
  appliedAt: Date;
}
