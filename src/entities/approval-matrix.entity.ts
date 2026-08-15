import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('approval_matrix')
export class ApprovalMatrix {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'request_type' })
  requestType: string; // e.g., 'budget_transfer', 'supplementary_budget'

  @Column({ name: 'level' })
  level: number; // order in approval chain

  @Column({ name: 'role' })
  role: string; // role identifier required at this level

  @Column({ name: 'is_mandatory', type: 'boolean', default: true })
  isMandatory: boolean;
}
