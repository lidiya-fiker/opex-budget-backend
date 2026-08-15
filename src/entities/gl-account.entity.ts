import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum BankingType {
  CONVENTIONAL = 'CONVENTIONAL',
  IFB = 'IFB',
}

@Entity('gl_accounts')
export class GlAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
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
