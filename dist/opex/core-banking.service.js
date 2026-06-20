"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CoreBankingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreBankingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const core_banking_entity_1 = require("../entities/core-banking.entity");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
const opex_alert_entity_1 = require("../entities/opex-alert.entity");
const notification_entity_1 = require("../entities/notification.entity");
const user_entity_1 = require("../entities/user.entity");
const opex_service_1 = require("./opex.service");
let CoreBankingService = CoreBankingService_1 = class CoreBankingService {
    transactionRepo;
    logRepo;
    budgetRepo;
    alertRepo;
    notificationRepo;
    userRepo;
    budgetService;
    logger = new common_1.Logger(CoreBankingService_1.name);
    constructor(transactionRepo, logRepo, budgetRepo, alertRepo, notificationRepo, userRepo, budgetService) {
        this.transactionRepo = transactionRepo;
        this.logRepo = logRepo;
        this.budgetRepo = budgetRepo;
        this.alertRepo = alertRepo;
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
        this.budgetService = budgetService;
    }
    onModuleInit() {
        setInterval(() => {
            this.logger.log('Starting scheduled 15-minute Core Banking integration scan...');
            this.syncTransactions().catch(err => {
                this.logger.error('Scheduled sync failed: ' + err.message);
            });
        }, 900000);
    }
    getFiscalPeriod(date) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (month >= 7) {
            return {
                fiscalYear: `${year}/${(year + 1).toString().slice(-2)}`,
                fiscalMonth: month - 6,
            };
        }
        else {
            return {
                fiscalYear: `${year - 1}/${year.toString().slice(-2)}`,
                fiscalMonth: month + 6,
            };
        }
    }
    async syncTransactions() {
        const startTime = new Date();
        try {
            const unmappedTx = await this.transactionRepo.find({
                where: { isMapped: false },
            });
            let mappedCount = 0;
            let unmappedCount = 0;
            for (const tx of unmappedTx) {
                const period = this.getFiscalPeriod(tx.transactionDate);
                const budgets = await this.budgetRepo.find({
                    where: { glNumber: tx.glNumber, status: 'APPROVED', fiscalYear: period.fiscalYear },
                    relations: ['branch', 'district', 'department'],
                });
                let matchedBudget = null;
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
                    await this.checkAndCreateAlert(matchedBudget);
                }
                else {
                    unmappedCount++;
                }
            }
            const log = this.logRepo.create({
                runTime: startTime,
                status: 'SUCCESS',
                recordsExtracted: unmappedTx.length,
            });
            await this.logRepo.save(log);
            return { success: true, count: mappedCount, unmapped: unmappedCount };
        }
        catch (err) {
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
    async checkAndCreateAlert(budget) {
        const stats = await this.budgetService.computeBudgetStats(budget);
        const today = new Date();
        const period = this.getFiscalPeriod(today);
        let ytdBudget = 0;
        const months = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];
        for (let i = 0; i < Math.min(period.fiscalMonth, 12); i++) {
            ytdBudget += Number(budget[months[i]] || 0);
        }
        const factor = budget.annualAmount > 0 ? (stats.currentBudget / budget.annualAmount) : 1;
        ytdBudget = ytdBudget * factor;
        const ytdActual = stats.actuals;
        if (ytdBudget > 0 && ytdActual > ytdBudget * 1.05) {
            const utilPct = Number(((ytdActual / ytdBudget) * 100).toFixed(2));
            const existingAlert = await this.alertRepo.findOneBy({
                opexBudget: { id: budget.id },
                status: 'ACTIVE',
            });
            if (!existingAlert) {
                const alert = this.alertRepo.create({
                    opexBudget: budget,
                    ytdBudget,
                    ytdActual,
                    utilizationPct: utilPct,
                    status: 'ACTIVE',
                });
                await this.alertRepo.save(alert);
                await this.sendAlertNotifications(budget, utilPct);
            }
        }
    }
    async sendAlertNotifications(budget, utilPct) {
        const message = `🚨 OPEX RED FLAG: Cost Center ${budget.branch?.name || budget.department?.name || budget.district?.name || 'Bankwide'} GL ${budget.glNumber} (${budget.glDescription}) utilization is at ${utilPct}% of YTD budget!`;
        if (budget.createdBy) {
            await this.createNotification(budget.createdBy, message, '/opex-dashboard');
        }
        if (budget.level === 'BRANCH' && budget.branch) {
            const branchManagers = await this.userRepo.find({
                where: { branch: { id: budget.branch.id }, role: user_entity_1.Role.BRANCH_MANAGER },
            });
            for (const mgr of branchManagers) {
                await this.createNotification(mgr, message, '/opex-dashboard');
            }
            if (budget.branch.district) {
                const distManagers = await this.userRepo.find({
                    where: { district: { id: budget.branch.district.id }, role: user_entity_1.Role.DISTRICT_MANAGER },
                });
                for (const dm of distManagers) {
                    await this.createNotification(dm, message, '/opex-dashboard');
                }
            }
        }
        const bccUsers = await this.userRepo.find({
            where: { role: user_entity_1.Role.BCC_TEAM },
        });
        for (const bcc of bccUsers) {
            await this.createNotification(bcc, message, '/opex-dashboard');
        }
    }
    async createNotification(user, message, actionLink) {
        const notif = this.notificationRepo.create({
            user,
            message,
            isRead: false,
            actionLink,
        });
        await this.notificationRepo.save(notif);
    }
    async manualMap(transactionId, budgetId) {
        const tx = await this.transactionRepo.findOneBy({ id: transactionId });
        if (!tx)
            throw new Error('Transaction not found');
        const budget = await this.budgetRepo.findOneBy({ id: budgetId });
        if (!budget)
            throw new Error('Budget not found');
        tx.isMapped = true;
        tx.mappedBudget = budget;
        const savedTx = await this.transactionRepo.save(tx);
        await this.checkAndCreateAlert(budget);
        return savedTx;
    }
    async generateMockTransactions(count = 5, fiscalYear) {
        const txs = [];
        const liveBudgets = await this.budgetRepo.find({ where: { status: 'APPROVED' }, relations: ['branch', 'district', 'department'] });
        const fallbackGls = ['30002', '31003', '34001', '35013', '35027'];
        const fallbackCcCodes = ['BR001', 'BR002', 'BR003', 'DEP001', 'DEP002', 'DEP003'];
        for (let i = 0; i < count; i++) {
            const isUnknown = Math.random() < 0.2;
            let glNumber = '99999';
            let costCenterCode = 'UNKNOWN';
            let description = 'Unknown Miscellaneous Posting';
            if (!isUnknown && liveBudgets.length > 0) {
                const b = liveBudgets[Math.floor(Math.random() * liveBudgets.length)];
                glNumber = b.glNumber;
                description = `${b.glDescription} (System Auto-Generated Expense)`;
                costCenterCode = b.branch?.code || b.department?.code || b.district?.code || 'BANKWIDE';
            }
            else if (!isUnknown) {
                glNumber = fallbackGls[Math.floor(Math.random() * fallbackGls.length)];
                costCenterCode = fallbackCcCodes[Math.floor(Math.random() * fallbackCcCodes.length)];
                description = 'Simulated Expense';
            }
            const amount = Math.floor(Math.random() * 450000) + 50000;
            let transactionDate = new Date();
            if (fiscalYear) {
                const parts = fiscalYear.split('/');
                const startYear = parseInt(parts[0], 10);
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
};
exports.CoreBankingService = CoreBankingService;
exports.CoreBankingService = CoreBankingService = CoreBankingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(core_banking_entity_1.CoreBankingTransaction)),
    __param(1, (0, typeorm_1.InjectRepository)(core_banking_entity_1.CoreBankingLog)),
    __param(2, (0, typeorm_1.InjectRepository)(opex_budget_entity_1.OpexBudget)),
    __param(3, (0, typeorm_1.InjectRepository)(opex_alert_entity_1.OpexAlert)),
    __param(4, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => opex_service_1.OpexBudgetService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        opex_service_1.OpexBudgetService])
], CoreBankingService);
//# sourceMappingURL=core-banking.service.js.map