import { AlertThresholdService } from './alert-threshold.service';
export declare class AlertThresholdController {
    private readonly thresholdService;
    constructor(thresholdService: AlertThresholdService);
    getThresholds(): Promise<import("../entities/alert-threshold.entity").AlertThreshold[]>;
    setThreshold(body: {
        level: 'BANKWIDE' | 'DISTRICT' | 'BRANCH' | 'GL';
        targetCode?: string;
        overUtilizationPct: number;
        warningPct: number;
        underUtilizationPct: number;
    }): Promise<import("../entities/alert-threshold.entity").AlertThreshold>;
}
