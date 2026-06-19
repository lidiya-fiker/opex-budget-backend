import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Branch } from './branch.entity';

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, nullable: true })
  code: string;

  @OneToMany(() => Branch, (branch) => branch.district)
  branches: Branch[];
}
