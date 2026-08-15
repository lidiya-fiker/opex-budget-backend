import { ReportingService } from './reporting.service';
import type { ReportLevel } from './reporting.service';
import * as express from 'express';
export declare class ReportingController {
    private readonly service;
    constructor(service: ReportingService);
    getBva(level: ReportLevel, cycleId: number, unitId: number): Promise<{
        level: ReportLevel;
        unitId: number | undefined;
        cycleId: number | undefined;
        totalBudget: number;
        totalActuals: number;
        remaining: number;
        utilizationPct: string;
        lineItems: import("../entities/opex-budget.entity").OpexBudget[];
    }>;
    exportBva(level: ReportLevel, cycleId: number, unitId: number, res: express.Response): Promise<void>;
    getManualPaymentDashboard(): Promise<Record<string, {
        count: number;
        total: number;
    }>>;
}
