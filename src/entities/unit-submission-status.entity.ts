import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('unit_submission_status')
export class UnitSubmissionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'unit_id' })
  unitId: number;

  @Column({ name: 'unit_code', type: 'varchar', nullable: true })
  unitCode: string; // branch code or MIS code

  @Column({ name: 'unit_name', type: 'varchar', nullable: true })
  unitName: string;

  @Column({ name: 'unit_type', type: 'varchar', nullable: true })
  unitType: string; // 'BRANCH' | 'HO' | 'DISTRICT'

  @Column({ name: 'budget_cycle_id', type: 'integer', nullable: true })
  budgetCycleId: number;

  @Column({ name: 'submitted', type: 'boolean', default: false })
  submitted: boolean;

  @Column({ name: 'submission_date', type: 'timestamp', nullable: true })
  submissionDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
