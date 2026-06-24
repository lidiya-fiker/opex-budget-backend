import { Injectable, OnModuleInit, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreBankingTransaction, CoreBankingLog } from '../entities/core-banking.entity';
import { OpexBudget } from '../entities/opex-budget.entity';
import { OpexAlert } from '../entities/opex-alert.entity';
import { Notification } from '../entities/notification.entity';
import { User, Role } from '../entities/user.entity';
import { OpexBudgetService } from './opex.service';

@Injectable()
export class CoreBankingService implements OnModuleInit {
  private readonly logger = new Logger(CoreBankingService.name);

  constructor(
    @InjectRepository(CoreBankingTransaction)
    private readonly transactionRepo: Repository<CoreBankingTransaction>,
    @InjectRepository(CoreBankingLog)
    private readonly logRepo: Repository<CoreBankingLog>,
    @InjectRepository(OpexBudget)
    private readonly budgetRepo: Repository<OpexBudget>,
    @InjectRepository(OpexAlert)
    private readonly alertRepo: Repository<OpexAlert>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(forwardRef(() => OpexBudgetService))
    private readonly budgetService: OpexBudgetService,
  ) {}

  onModuleInit() {
    // Run core banking sync every 15 minutes (900000 ms)
    setInterval(() => {
      this.logger.log('Starting scheduled 15-minute Core Banking integration scan...');
      this.syncTransactions().catch(err => {
        this.logger.error('Scheduled sync failed: ' + err.message);
      });
    }, 900000);
  }

  // Helper to map transaction date to Ethiopian fiscal periods
  getFiscalPeriod(date: Date): { fiscalYear: string; fiscalMonth: number } {
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();

    if (month >= 7) {
      // July to Dec (Month 1-6 of fiscal year)
      return {
        fiscalYear: `${year}/${(year + 1).toString().slice(-2)}`,
        fiscalMonth: month - 6,
      };
    } else {
      // Jan to June (Month 7-12 of fiscal year)
      return {
        fiscalYear: `${year - 1}/${year.toString().slice(-2)}`,
        fiscalMonth: month + 6,
      };
    }
  }

  // Perform transaction synchronization & mapping
  async syncTransactions(): Promise<{ success: boolean; count: number; unmapped: number; error?: string }> {
    const startTime = new Date();
    try {
      const unmappedTx = await this.transactionRepo.find({
        where: { isMapped: false },
      });

      let mappedCount = 0;
      let unmappedCount = 0;

      for (const tx of unmappedTx) {
        // Attempt to find a matching approved budget
        // We match by GL Number, level cost center code, and transaction's fiscal year
        const period = this.getFiscalPeriod(tx.transactionDate);
        const budgets = await this.budgetRepo.find({
          where: { glNumber: tx.glNumber, status: 'APPROVED', fiscalYear: period.fiscalYear },
          relations: ['branch', 'district', 'department'],
        });

        let matchedBudget: OpexBudget | null = null;

        for (const b of budgets) {
          if (b.level === 'BRANCH' && b.branch?.code === tx.costCenterCode) {
            matchedBudget = b;
            break;
          }
          if (b.level === 'DEPARTMENT' && b.department?.code === tx.costCenterCode) {
            matchedBudget = b;
            break;
          }
          if (b.level === 'DISTRICT' && b.district?.code === tx.costCenterCode) {
            matchedBudget = b;
            break;
          }
          if (b.level === 'BANKWIDE') {
            matchedBudget = b;
            break;
          }
        }

        if (matchedBudget) {
          tx.isMapped = true;
          tx.mappedBudget = matchedBudget;
          await this.transactionRepo.save(tx);
          mappedCount++;

          // Check if this mapping triggers an alert
          await this.checkAndCreateAlert(matchedBudget);
        } else {
          unmappedCount++;
        }
      }

      // Bulk re-evaluate all active alerts (in case budgets were updated but alerts got stuck)
      const activeAlerts = await this.alertRepo.find({
        where: { status: 'ACTIVE' },
        relations: ['opexBudget'],
      });
      for (const alert of activeAlerts) {
        if (alert.opexBudget) {
          await this.checkAndCreateAlert(alert.opexBudget);
        }
      }

      // Log success
      const log = this.logRepo.create({
        runTime: startTime,
        status: 'SUCCESS',
        recordsExtracted: unmappedTx.length,
      });
      await this.logRepo.save(log);

      return { success: true, count: mappedCount, unmapped: unmappedCount };
    } catch (err) {
      this.logger.error('Error during transaction sync: ', err);
      const log = this.logRepo.create({
        runTime: startTime,
        status: 'FAILED',
        recordsExtracted: 0,
        errorMessage: err.message,
      });
      await this.logRepo.save(log);
      return { success: false, count: 0, unmapped: 0, error: err.message };
    }
  }

  // Trigger alert check for a specific budget
  async checkAndCreateAlert(budget: OpexBudget) {
    const stats = await this.budgetService.computeBudgetStats(budget);
    const today = new Date();
    const period = this.getFiscalPeriod(today);

    // Sum YTD budget (from m1 up to current fiscal month)
    let ytdBudget = 0;
    const months = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];
    for (let i = 0; i < Math.min(period.fiscalMonth, 12); i++) {
      ytdBudget += Number(budget[months[i]] || 0);
    }

    // Apply any approved transfer additions to YTD budget proportionally (or fully)
    const factor = budget.annualAmount > 0 ? (stats.currentBudget / budget.annualAmount) : 1;
    ytdBudget = ytdBudget * factor;

    const ytdActual = stats.actuals;

    const utilPct = ytdBudget > 0 ? Number(((ytdActual / ytdBudget) * 100).toFixed(2)) : 0;

    const existingAlert = await this.alertRepo.findOneBy({
      opexBudget: { id: budget.id },
      status: 'ACTIVE',
    });

    if (ytdBudget > 0 && ytdActual > ytdBudget * 1.05) {
      if (!existingAlert) {
        const alert = this.alertRepo.create({
          opexBudget: budget,
          ytdBudget,
          ytdActual,
          utilizationPct: utilPct,
          status: 'ACTIVE',
        });
        await this.alertRepo.save(alert);

        // Send notifications to stakeholders
        await this.sendAlertNotifications(budget, utilPct);
      } else {
        // Update existing alert with new numbers
        existingAlert.ytdBudget = ytdBudget;
        existingAlert.ytdActual = ytdActual;
        existingAlert.utilizationPct = utilPct;
        await this.alertRepo.save(existingAlert);
      }
    } else {
      // Auto-resolve if utilization falls back within limits
      if (existingAlert) {
        existingAlert.status = 'RESOLVED';
        existingAlert.ytdBudget = ytdBudget;
        existingAlert.ytdActual = ytdActual;
        existingAlert.utilizationPct = utilPct;
        await this.alertRepo.save(existingAlert);
      }
    }
  }

  // Send system notifications for a budget alert
  async sendAlertNotifications(budget: OpexBudget, utilPct: number) {
    const message = `🚨 OPEX RED FLAG: Cost Center ${budget.branch?.name || budget.department?.name || budget.district?.name || 'Bankwide'} GL ${budget.glNumber} (${budget.glDescription}) utilization is at ${utilPct}% of YTD budget!`;

    // Notify budget creator
    if (budget.createdBy) {
      await this.createNotification(budget.createdBy, message, '/opex-dashboard');
    }

    // Notify branch manager & district manager if branch budget
    if (budget.level === 'BRANCH' && budget.branch) {
      // Find branch managers
      const branchManagers = await this.userRepo.find({
        where: { branch: { id: budget.branch.id }, role: Role.BRANCH_MANAGER },
      });
      for (const mgr of branchManagers) {
        await this.createNotification(mgr, message, '/opex-dashboard');
      }

      // Find district managers
      if (budget.branch.district) {
        const distManagers = await this.userRepo.find({
          where: { district: { id: budget.branch.district.id }, role: Role.DISTRICT_MANAGER },
        });
        for (const dm of distManagers) {
          await this.createNotification(dm, message, '/opex-dashboard');
        }
      }
    }

    // Notify BCC Team
    const bccUsers = await this.userRepo.find({
      where: { role: Role.BCC_TEAM },
    });
    for (const bcc of bccUsers) {
      await this.createNotification(bcc, message, '/opex-dashboard');
    }
  }

  private async createNotification(user: User, message: string, actionLink?: string) {
    const notif = this.notificationRepo.create({
      user,
      message,
      isRead: false,
      actionLink,
    });
    await this.notificationRepo.save(notif);
  }

  // Manually map a transaction
  async manualMap(transactionId: number, budgetId: number): Promise<CoreBankingTransaction> {
    const tx = await this.transactionRepo.findOneBy({ id: transactionId });
    if (!tx) throw new Error('Transaction not found');

    const budget = await this.budgetRepo.findOneBy({ id: budgetId });
    if (!budget) throw new Error('Budget not found');

    tx.isMapped = true;
    tx.mappedBudget = budget;
    const savedTx = await this.transactionRepo.save(tx);

    // Check for alerts
    await this.checkAndCreateAlert(budget);

    return savedTx;
  }

  // Simulator to inject transactions
  async generateMockTransactions(count = 5, fiscalYear?: string): Promise<CoreBankingTransaction[]> {
    const txs: CoreBankingTransaction[] = [];
    
    // Fetch live approved budgets to ensure we generate transactions that will actually map
    const liveBudgets = await this.budgetRepo.find({ where: { status: 'APPROVED' }, relations: ['branch', 'district', 'department'] });
    
    const fallbackGls = ['31005', '31013', '31017', '34001', '34006', '34009', '34010', '34011', '34013', '34017', '34019', '34020', '34024', '34027', '35004', '35008', '35013', '35027', '35031', '35033', '35034', '35035', '35040', '35042', '35043', '35194'];
    const fallbackCcCodes = ['BR001', 'BR002', 'BR003', 'DEP001', 'DEP002', 'DEP003'];

    for (let i = 0; i < count; i++) {
      // 5% chance to generate an intentionally unmapped/unknown transaction (minimized for demo)
      const isUnknown = Math.random() < 0.05;
      
      let glNumber = '99999';
      let costCenterCode = 'UNKNOWN';
      let description = 'Unknown Miscellaneous Posting';
      
      if (!isUnknown && liveBudgets.length > 0) {
        // Pick a real budget line to guarantee a map
        const b = liveBudgets[Math.floor(Math.random() * liveBudgets.length)];
        glNumber = b.glNumber;
        description = `${b.glDescription} (System Auto-Generated Expense)`;
        costCenterCode = b.branch?.code || b.department?.code || b.district?.code || 'BANKWIDE';
      } else if (!isUnknown) {
        glNumber = fallbackGls[Math.floor(Math.random() * fallbackGls.length)];
        costCenterCode = fallbackCcCodes[Math.floor(Math.random() * fallbackCcCodes.length)];
        description = 'Simulated Expense';
      }

      // Generate random high amount to trigger alerts often (e.g. 50k to 500k ETB)
      const amount = Math.floor(Math.random() * 450000) + 50000;

      let transactionDate = new Date();
      if (fiscalYear) {
        const parts = fiscalYear.split('/');
        const startYear = parseInt(parts[0], 10);
        // Set to August of starting year (Month 8, which is index 7)
        transactionDate = new Date(startYear, 7, Math.floor(Math.random() * 28) + 1);
      }

      const tx = this.transactionRepo.create({
        transactionDate,
        glNumber,
        costCenterCode,
        amount,
        description,
        isMapped: false,
      });

      txs.push(await this.transactionRepo.save(tx));
    }

    return txs;
  }
}
