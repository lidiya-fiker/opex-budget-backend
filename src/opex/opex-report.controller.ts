import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpexBudget } from '../entities/opex-budget.entity';
import { CoreBankingTransaction } from '../entities/core-banking.entity';
import { Branch } from '../entities/branch.entity';
import { District } from '../entities/district.entity';
import { Department } from '../entities/department.entity';
import { OpexBudgetService } from './opex.service';

@Controller('opex-reports')
@UseGuards(AuthGuard('jwt'))
export class OpexReportController {
  constructor(
    private readonly budgetService: OpexBudgetService,
    @InjectRepository(OpexBudget)
    private readonly budgetRepo: Repository<OpexBudget>,
    @InjectRepository(CoreBankingTransaction)
    private readonly transactionRepo: Repository<CoreBankingTransaction>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  // Helper to extract transactions for a budget line and month
  private async getActualsForBudget(budgetId: number, monthIndex: number): Promise<{ monthly: number; ytd: number }> {
    // Sum for monthIndex (1-12)
    // Month 1 is July, Month 12 is June
    // We filter transactions mapped to budgetId whose month corresponds to the fiscal month index
    const txs = await this.transactionRepo.find({
      where: { mappedBudget: { id: budgetId } },
    });

    let monthly = 0;
    let ytd = 0;

    const months = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];

    for (const tx of txs) {
      const date = new Date(tx.transactionDate);
      const m = date.getMonth() + 1; // 1-12
      let txFiscalMonth = 0;
      if (m >= 7) txFiscalMonth = m - 6;
      else txFiscalMonth = m + 6;

      const amount = Number(tx.amount);

      if (txFiscalMonth === monthIndex) {
        monthly += amount;
      }
      if (txFiscalMonth <= monthIndex) {
        ytd += amount;
      }
    }

    return { monthly, ytd };
  }

  @Get('bva')
  async getBvaReport(
    @Query('fiscalYear') fiscalYear?: string,
    @Query('level') level?: 'BANKWIDE' | 'DISTRICT' | 'DEPARTMENT' | 'BRANCH',
    @Query('targetId') targetId?: string,
    @Query('month') monthStr?: string,
  ) {
    const fy = fiscalYear || '2026/27';
    const month = monthStr ? parseInt(monthStr, 10) : 12;

    const qb = this.budgetRepo.createQueryBuilder('b')
      .leftJoinAndSelect('b.branch', 'branch')
      .leftJoinAndSelect('b.district', 'district')
      .leftJoinAndSelect('b.department', 'department')
      .where('b.fiscalYear = :fy AND b.status = :status', { fy, status: 'APPROVED' });

    if (level) {
      qb.andWhere('b.level = :level', { level });
      if (targetId) {
        if (level === 'BRANCH') qb.andWhere('b.branchId = :targetId', { targetId });
        if (level === 'DEPARTMENT') qb.andWhere('b.departmentId = :targetId', { targetId });
        if (level === 'DISTRICT') qb.andWhere('b.districtId = :targetId', { targetId });
      }
    }

    const budgets = await qb.getMany();
    const rows: any[] = [];

    const months = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];

    for (const b of budgets) {
      const stats = await this.budgetService.computeBudgetStats(b);
      const factor = b.annualAmount > 0 ? (stats.currentBudget / b.annualAmount) : 1;

      // Monthly Budget
      const monthlyBudget = Number(b[months[month - 1]] || 0) * factor;

      // YTD Budget (sum up to month)
      let ytdBudget = 0;
      for (let i = 0; i < month; i++) {
        ytdBudget += Number(b[months[i]] || 0) * factor;
      }

      // Actuals
      const actuals = await this.getActualsForBudget(b.id, month);

      const monthlyActual = actuals.monthly;
      const ytdActual = actuals.ytd;

      const monthlyVariance = monthlyBudget - monthlyActual;
      const ytdVariance = ytdBudget - ytdActual;

      const monthlyUtil = monthlyBudget > 0 ? Number(((monthlyActual / monthlyBudget) * 100).toFixed(2)) : 0;
      const ytdUtil = ytdBudget > 0 ? Number(((ytdActual / ytdBudget) * 100).toFixed(2)) : 0;

      rows.push({
        id: b.id,
        glNumber: b.glNumber,
        glDescription: b.glDescription,
        expenseCategory: b.expenseCategory,
        level: b.level,
        costCenterCode: b.branch?.code || b.department?.code || b.district?.code || 'BANKWIDE',
        costCenterName: b.branch?.name || b.department?.name || b.district?.name || 'Bankwide Consolidated',
        monthlyBudget,
        monthlyActual,
        monthlyVariance,
        monthlyUtilizationPct: monthlyUtil,
        ytdBudget,
        ytdActual,
        ytdVariance,
        ytdUtilizationPct: ytdUtil,
      });
    }

    return rows;
  }

  @Get('branches')
  async getBranchCategoryReport(
    @Query('fiscalYear') fiscalYear?: string,
    @Query('month') monthStr?: string,
  ) {
    const fy = fiscalYear || '2026/27';
    const month = monthStr ? parseInt(monthStr, 10) : 12;

    // We get all branches
    const branches = await this.branchRepo.find({ relations: ['district'], order: { district: { name: 'ASC' }, name: 'ASC' } });
    const categories = [
      'Interest Expense',
      'Salaries & Benefits',
      'Other Operating Expense',
      'Fees & Commission Expense',
      'Depreciation & Amortization',
    ];

    const branchRows: any[] = [];

    const months = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];

    for (const branch of branches) {
      const row: any = {
        districtName: branch.district?.name || 'Other',
        branchCode: branch.code,
        branchName: branch.name,
        categories: {},
        totalBudget: 0,
        totalActual: 0,
      };

      for (const cat of categories) {
        // Find approved budget for this branch & category
        const b = await this.budgetRepo.findOne({
          where: { branch: { id: branch.id }, expenseCategory: cat, fiscalYear: fy, status: 'APPROVED' },
        });

        let catBudget = 0;
        let catActual = 0;

        if (b) {
          const stats = await this.budgetService.computeBudgetStats(b);
          const factor = b.annualAmount > 0 ? (stats.currentBudget / b.annualAmount) : 1;
          // Sum up to month
          for (let i = 0; i < month; i++) {
            catBudget += Number(b[months[i]] || 0) * factor;
          }

          const actuals = await this.getActualsForBudget(b.id, month);
          catActual = actuals.ytd;
        }

        row.categories[cat] = {
          budget: catBudget,
          actual: catActual,
        };

        row.totalBudget += catBudget;
        row.totalActual += catActual;
      }

      branchRows.push(row);
    }

    return branchRows;
  }

  @Get('exception')
  async getExceptionReport(
    @Query('fiscalYear') fiscalYear?: string,
    @Query('month') monthStr?: string,
  ) {
    const bva = await this.getBvaReport(fiscalYear, undefined, undefined, monthStr);

    // Filter items where utilization deviates by more than 5% (i.e. > 105% or < 95%)
    // But exclude rows where budget is 0
    return bva.filter(row => {
      if (row.ytdBudget === 0) return false;
      const dev = row.ytdUtilizationPct;
      return dev > 105 || dev < 95;
    });
  }
}
