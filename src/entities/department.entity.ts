import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Branch } from './branch.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // e.g. 'DEP001'

  @Column()
  name: string; // e.g. 'IT Department'
  @OneToMany(() => Branch, branch => branch.department)
  branches: Branch[];
}
