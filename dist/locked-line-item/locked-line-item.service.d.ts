import { Repository } from 'typeorm';
import { LockedLineItem } from '../entities/locked-line-item.entity';
export declare class LockedLineItemService {
    private readonly repo;
    constructor(repo: Repository<LockedLineItem>);
    findAll(): Promise<LockedLineItem[]>;
    lock(data: Partial<LockedLineItem>): Promise<LockedLineItem>;
    unlock(id: number): Promise<LockedLineItem>;
    isLocked(lineItemCode: string): Promise<boolean>;
}
