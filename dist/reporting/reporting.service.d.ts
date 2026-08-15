import { Repository } from 'typeorm';
import { OpexBudget } from '../entities/opex-budget.entity';
import { ManualPayment } from '../entities/manual-payment.entity';
export type ReportLevel = 'BANK' | 'CHIEF' | 'HO' | 'DISTRICT' | 'BRANCH' | 'BUDGET_OWNER';
export declare class ReportingService {
    private readonly opexRepo;
    private readonly paymentRepo;
    constructor(opexRepo: Repository<OpexBudget>, paymentRepo: Repository<ManualPayment>);
    getBvaReport(level: ReportLevel, unitId?: number, cycleId?: number): Promise<{
        level: ReportLevel;
        unitId: number | undefined;
        cycleId: number | undefined;
        totalBudget: number;
        totalActuals: number;
        remaining: number;
        utilizationPct: string;
        lineItems: OpexBudget[];
    }>;
    exportBvaReport(level: ReportLevel, unitId?: number, cycleId?: number): Promise<Buffer>;
    getManualPaymentDashboard(): Promise<Record<string, {
        count: number;
        total: number;
    }>>;
}
