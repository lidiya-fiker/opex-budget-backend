import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Branch } from './branch.entity';
import { District } from './district.entity';
import { Department } from './department.entity';

export enum Role {
  BRANCH_USER = 'BRANCH_USER',           // Branch-level finance officer who submits budgets
  BRANCH_MANAGER = 'BRANCH_MANAGER',     // Approves branch budget before district review
  DISTRICT_MANAGER = 'DISTRICT_MANAGER', // Reviews and approves district-level budgets
  DEPARTMENT_USER = 'DEPARTMENT_USER',   // Generic HO department user
  PAYMENT_SETTLEMENT = 'PAYMENT_SETTLEMENT', // Payment & Settlement team — can initiate manual payments (restricted amount visibility)
  FIRD = 'FIRD',                         // FIRD team — can initiate manual payments (restricted amount visibility)
  BUDGET_OWNER = 'BUDGET_OWNER',         // Budget owner — has full visibility of their approved budget amounts
  CHIEF_OFFICER = 'CHIEF_OFFICER',       // Chief Officer — approves budget transfers per policy
  BCC_TEAM = 'BCC_TEAM',               // Budget Control Center — manages budget cycle, approvals, transfers
  STRATEGY_OFFICER = 'STRATEGY_OFFICER', // Strategy office — reviews consolidated budget
  EXECUTIVE = 'EXECUTIVE',               // CEO / Executive — approves supplementary budgets
  BOARD = 'BOARD',                       // Board of Directors — final approval
  ADMIN = 'ADMIN',                       // System admin
  INTERNAL_AUDIT = 'INTERNAL_AUDIT',     // Read-only audit access
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  displayName: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', default: Role.BRANCH_USER })
  role: Role;

  @ManyToOne(() => Branch, { nullable: true, eager: true })
  branch: Branch | null;

  @ManyToOne(() => District, { nullable: true, eager: true })
  district: District | null;

  @ManyToOne(() => Department, { nullable: true, eager: true })
  department: Department | null;
}
