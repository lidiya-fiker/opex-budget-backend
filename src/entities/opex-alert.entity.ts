import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { OpexBudget } from './opex-budget.entity';
import { User } from './user.entity';

@Entity('opex_alerts')
export class OpexAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OpexBudget, { eager: true })
  opexBudget: OpexBudget;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  ytdBudget: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  ytdActual: number;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  utilizationPct: number;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

  @Column({ type: 'text', nullable: true })
  resolutionRemark: string | null;

  @ManyToOne(() => User, { nullable: true, eager: true })
  resolvedBy: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
