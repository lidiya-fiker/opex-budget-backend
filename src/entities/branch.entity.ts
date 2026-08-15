import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Department } from './department.entity';
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

  @Column({ type: 'varchar', nullable: true })
  area: string | null;

  @Column({ type: 'varchar', nullable: true })
  region: string | null;

  @Column({ type: 'varchar', nullable: true })
  zone: string | null;

  @Column({ type: 'varchar', nullable: true })
  city: string | null;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string | null;

  @Column({ type: 'varchar', default: 'CONVENTIONAL' })
  bankingType: 'CONVENTIONAL' | 'IFB' | 'HYBRID';

  @Column({ default: false })
  isClosed: boolean;

  @ManyToOne(() => District, (district) => district.branches, { eager: true })
  district: District;

  @ManyToOne(() => Department, (department) => department.branches, { nullable: true, eager: true })
  department: Department | null;

  @OneToMany(() => BudgetSubmission, (submission) => submission.branch)
  submissions: BudgetSubmission[];
}
