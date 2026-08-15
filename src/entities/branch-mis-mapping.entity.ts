import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('branch_mis_mapping')
export class BranchMisMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'branch_code', unique: true })
  branchCode: string;

  @Column({ name: 'mis_code', nullable: true })
  misCode: string; // for HO units

  @Column({ name: 'branch_name' })
  branchName: string;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'unit_type' })
  unitType: string; // 'BRANCH' | 'DISTRICT' | 'HO'

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'opened_at', type: 'date', nullable: true })
  openedAt: Date;

  @Column({ name: 'closed_at', type: 'date', nullable: true })
  closedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
