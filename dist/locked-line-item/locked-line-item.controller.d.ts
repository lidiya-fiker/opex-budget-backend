import { LockedLineItemService } from './locked-line-item.service';
import { LockedLineItem } from '../entities/locked-line-item.entity';
export declare class LockedLineItemController {
    private readonly service;
    constructor(service: LockedLineItemService);
    findAll(): Promise<LockedLineItem[]>;
    lock(body: Partial<LockedLineItem>): Promise<LockedLineItem>;
    unlock(id: number): Promise<LockedLineItem>;
    isLocked(code: string): Promise<boolean>;
}
