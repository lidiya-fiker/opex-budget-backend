import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum BankingType {
  CONVENTIONAL = 'CONVENTIONAL',
  IFB = 'IFB',
}

@Entity('gl_accounts')
@Index(['glCode', 'bankingType'], { unique: true })
export class GlAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  glCode: string;

  @Column()
  glDescription: string;

  @Column({ type: 'varchar', default: 'CONVENTIONAL' })
  bankingType: BankingType;

  @Column({ type: 'varchar', nullable: true })
  categoryGroup: string | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
