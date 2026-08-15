export declare class LockedLineItem {
    id: number;
    lineItemCode: string;
    lineItemName: string;
    reason: string;
    lockedAt: Date;
    unlockedAt: Date | null;
}
