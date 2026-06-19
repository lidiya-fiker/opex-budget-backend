import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('expense_categories')
export class ExpenseCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  group: string;

  @Column({ default: false })
  isMandatory: boolean;
}
