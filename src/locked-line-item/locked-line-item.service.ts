import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LockedLineItem } from '../entities/locked-line-item.entity';

@Injectable()
export class LockedLineItemService {
  constructor(
    @InjectRepository(LockedLineItem)
    private readonly repo: Repository<LockedLineItem>,
  ) {}

  async findAll(): Promise<LockedLineItem[]> {
    return this.repo.find();
  }

  async lock(data: Partial<LockedLineItem>): Promise<LockedLineItem> {
    const item = new LockedLineItem();
    Object.assign(item, data);
    item.lockedAt = new Date();
    item.unlockedAt = null;
    return this.repo.save(item);
  }

  async unlock(id: number): Promise<LockedLineItem> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Locked item #${id} not found`);
    item.unlockedAt = new Date();
    return this.repo.save(item);
  }

  async isLocked(lineItemCode: string): Promise<boolean> {
    const item = await this.repo.findOne({ where: { lineItemCode } });
    return !!(item && item.lockedAt && !item.unlockedAt);
  }
}
