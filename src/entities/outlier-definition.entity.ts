import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('outlier_definitions')
export class OutlierDefinition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['TREND', 'TARGET', 'CONTRACT', 'NEEDS'] })
  category: string;

  @Column({ name: 'criteria_json', type: 'jsonb', nullable: true })
  criteriaJson: Record<string, any>; // thresholds and parameters for detection

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
