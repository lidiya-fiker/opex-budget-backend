import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpexBudget } from '../entities/opex-budget.entity';
import { ManualPayment } from '../entities/manual-payment.entity';
import * as XLSX from 'xlsx';

export type ReportLevel = 'BANK' | 'CHIEF' | 'HO' | 'DISTRICT' | 'BRANCH' | 'BUDGET_OWNER';

@Injectable()
export class ReportingService {
  constructor(
    @InjectRepository(OpexBudget)
    private readonly opexRepo: Repository<OpexBudget>,
    @InjectRepository(ManualPayment)
    private readonly paymentRepo: Repository<ManualPayment>,
  ) {}

  /**
   * Returns budget vs actual summary filtered by level and optional unitId.
   * level: BANK | CHIEF | HO | DISTRICT | BRANCH | BUDGET_OWNER
   */
  async getBvaReport(level: ReportLevel, unitId?: number, cycleId?: number) {
    const qb = this.opexRepo.createQueryBuilder('ob');

    if (cycleId) qb.andWhere('ob.budgetCycleId = :cycleId', { cycleId });

    switch (level) {
      case 'BANK':
        break; // no filter — all records
      case 'DISTRICT':
        if (unitId) qb.andWhere('ob.districtId = :unitId', { unitId });
        break;
      case 'BRANCH':
        if (unitId) qb.andWhere('ob.branchId = :unitId', { unitId });
        break;
      case 'BUDGET_OWNER':
        if (unitId) qb.andWhere('ob.ownerId = :unitId', { unitId });
        break;
      default:
        break;
    }

    const records = await qb.getMany();
    const totalBudget = records.reduce((s, r) => s + Number(r.annualAmount), 0);
    const totalActuals = 0; // actuals fetched from CBS integration, not stored on OpexBudget directly

    return {
      level,
      unitId,
      cycleId,
      totalBudget,
      totalActuals,
      remaining: totalBudget - totalActuals,
      utilizationPct: totalBudget > 0 ? ((totalActuals / totalBudget) * 100).toFixed(2) : '0',
      lineItems: records,
    };
  }

  /**
   * Exports BVA report to Excel buffer using xlsx
   */
  async exportBvaReport(level: ReportLevel, unitId?: number, cycleId?: number): Promise<Buffer> {
    const data = await this.getBvaReport(level, unitId, cycleId);
    
    const rows = data.lineItems.map(item => ({
      'GL Number': item.glNumber,
      'GL Description': item.glDescription,
      'Annual Amount': item.annualAmount,
      'M1': item.m1,
      'M2': item.m2,
      'M3': item.m3,
      'M4': item.m4,
      'M5': item.m5,
      'M6': item.m6,
      'M7': item.m7,
      'M8': item.m8,
      'M9': item.m9,
      'M10': item.m10,
      'M11': item.m11,
      'M12': item.m12,
      'Status': item.status,
      'Fiscal Year': item.fiscalYear,
      'Level': item.level,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BVA Report');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }

  /**
   * Manual-payment dashboard summary for BCC — grouped by payment type.
   */
  async getManualPaymentDashboard() {
    const payments = await this.paymentRepo.find();
    const grouped: Record<string, { count: number; total: number }> = {};

    for (const p of payments) {
      const type = p.budgetCode || 'OTHER';
      if (!grouped[type]) grouped[type] = { count: 0, total: 0 };
      grouped[type].count++;
      grouped[type].total += Number(p.amount);
    }

    return grouped;
  }
}
