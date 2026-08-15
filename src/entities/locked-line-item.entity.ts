import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('locked_line_items')
export class LockedLineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'line_item_code' })
  lineItemCode: string; // e.g. 'DEPOSIT_INTEREST', 'DEPRECIATION'

  @Column({ name: 'line_item_name' })
  lineItemName: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ name: 'locked_at', type: 'timestamp', nullable: true })
  lockedAt: Date;

  @Column({ name: 'unlocked_at', type: 'timestamp', nullable: true })
  unlockedAt: Date | null;
}
