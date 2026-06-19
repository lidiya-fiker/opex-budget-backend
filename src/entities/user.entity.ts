import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Branch } from './branch.entity';
import { District } from './district.entity';

export enum Role {
  BRANCH_USER = 'BRANCH_USER',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  DISTRICT_MANAGER = 'DISTRICT_MANAGER',
  BCC_TEAM = 'BCC_TEAM',
  STRATEGY_OFFICER = 'STRATEGY_OFFICER',
  EXECUTIVE = 'EXECUTIVE',
  BOARD = 'BOARD',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  displayName: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', default: Role.BRANCH_USER })
  role: Role;

  @ManyToOne(() => Branch, { nullable: true, eager: true })
  branch: Branch | null;

  @ManyToOne(() => District, { nullable: true, eager: true })
  district: District | null;
}
