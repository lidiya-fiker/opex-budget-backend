import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { BudgetSubmission } from './budget-submission.entity';
import { District } from './district.entity';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // e.g., 'BR001'

  @Column()
  name: string;

  @ManyToOne(() => District, (district) => district.branches)
  district: District;

  @OneToMany(() => BudgetSubmission, (submission) => submission.branch)
  submissions: BudgetSubmission[];
}
