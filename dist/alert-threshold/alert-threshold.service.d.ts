import { Repository } from 'typeorm';
import { AlertThreshold } from '../entities/alert-threshold.entity';
export declare class AlertThresholdService {
    private readonly thresholdRepo;
    constructor(thresholdRepo: Repository<AlertThreshold>);
    findAll(): Promise<AlertThreshold[]>;
    setThreshold(data: {
        level: 'BANKWIDE' | 'DISTRICT' | 'BRANCH' | 'GL';
        targetCode?: string;
        overUtilizationPct: number;
        warningPct: number;
        underUtilizationPct: number;
    }): Promise<AlertThreshold>;
    getEffectiveThreshold(level: 'DISTRICT' | 'BRANCH' | 'GL', targetCode?: string): Promise<AlertThreshold | {
        overUtilizationPct: number;
        warningPct: number;
        underUtilizationPct: number;
    }>;
}
