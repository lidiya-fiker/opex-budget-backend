import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('capex_business_cases')
export class CapexBusinessCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'investment_amount', type: 'numeric', precision: 16, scale: 2 })
  investmentAmount: number;

  // JSON object holding criterion name => score (0-100)
  @Column({ name: 'evaluation_json', type: 'jsonb', nullable: true })
  evaluationJson: Record<string, number>;

  @Column({ name: 'total_score', type: 'numeric', precision: 6, scale: 2, nullable: true })
  totalScore: number;

  @Column({ default: 'DRAFT' })
  status: string; // 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'

  @Column({ name: 'submitted_by', nullable: true })
  submittedBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
