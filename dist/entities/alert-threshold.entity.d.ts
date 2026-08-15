export declare class AlertThreshold {
    id: number;
    level: 'BANKWIDE' | 'DISTRICT' | 'BRANCH' | 'GL';
    targetCode: string | null;
    overUtilizationPct: number;
    warningPct: number;
    underUtilizationPct: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
