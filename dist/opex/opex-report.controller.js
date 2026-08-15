"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpexReportController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
const core_banking_entity_1 = require("../entities/core-banking.entity");
const branch_entity_1 = require("../entities/branch.entity");
const district_entity_1 = require("../entities/district.entity");
const department_entity_1 = require("../entities/department.entity");
const opex_service_1 = require("./opex.service");
const express = __importStar(require("express"));
const XLSX = __importStar(require("xlsx"));
let OpexReportController = class OpexReportController {
    budgetService;
    budgetRepo;
    transactionRepo;
    branchRepo;
    districtRepo;
    departmentRepo;
    constructor(budgetService, budgetRepo, transactionRepo, branchRepo, districtRepo, departmentRepo) {
        this.budgetService = budgetService;
        this.budgetRepo = budgetRepo;
        this.transactionRepo = transactionRepo;
        this.branchRepo = branchRepo;
        this.districtRepo = districtRepo;
        this.departmentRepo = departmentRepo;
    }
    async getActualsForBudget(budgetId, monthIndex) {
        const txs = await this.transactionRepo.find({
            where: { mappedBudget: { id: budgetId } },
        });
        let monthly = 0;
        let ytd = 0;
        const months = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];
        for (const tx of txs) {
            const date = new Date(tx.transactionDate);
            const m = date.getMonth() + 1;
            let txFiscalMonth = 0;
            if (m >= 7)
                txFiscalMonth = m - 6;
            else
                txFiscalMonth = m + 6;
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
    async getBvaReport(fiscalYear, level, targetId, monthStr) {
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
                if (level === 'BRANCH')
                    qb.andWhere('b.branchId = :targetId', { targetId });
                if (level === 'DEPARTMENT')
                    qb.andWhere('b.departmentId = :targetId', { targetId });
                if (level === 'DISTRICT')
                    qb.andWhere('b.districtId = :targetId', { targetId });
            }
        }
        const budgets = await qb.getMany();
        const rows = [];
        const months = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];
        for (const b of budgets) {
            const stats = await this.budgetService.computeBudgetStats(b);
            const factor = b.annualAmount > 0 ? (stats.currentBudget / b.annualAmount) : 1;
            const monthlyBudget = Number(b[months[month - 1]] || 0) * factor;
            let ytdBudget = 0;
            for (let i = 0; i < month; i++) {
                ytdBudget += Number(b[months[i]] || 0) * factor;
            }
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
    async exportBva(fiscalYear, level, targetId, monthStr, res) {
        const data = await this.getBvaReport(fiscalYear, level, targetId, monthStr);
        const rows = data.map(item => ({
            'GL Number': item.glNumber,
            'GL Description': item.glDescription,
            'Category': item.expenseCategory,
            'Level': item.level,
            'Cost Center Code': item.costCenterCode,
            'Cost Center Name': item.costCenterName,
            'Monthly Budget': item.monthlyBudget,
            'Monthly Actual': item.monthlyActual,
            'Monthly Variance': item.monthlyVariance,
            'Monthly Util %': item.monthlyUtilizationPct,
            'YTD Budget': item.ytdBudget,
            'YTD Actual': item.ytdActual,
            'YTD Variance': item.ytdVariance,
            'YTD Util %': item.ytdUtilizationPct,
        }));
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'BVA Report');
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="opex-bva-report.xlsx"`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async getBranchCategoryReport(fiscalYear, monthStr) {
        const fy = fiscalYear || '2026/27';
        const month = monthStr ? parseInt(monthStr, 10) : 12;
        const branches = await this.branchRepo.find({ relations: ['district'], order: { district: { name: 'ASC' }, name: 'ASC' } });
        const categories = [
            'Interest Expense',
            'Salaries & Benefits',
            'Other Operating Expense',
            'Fees & Commission Expense',
            'Depreciation & Amortization',
        ];
        const branchRows = [];
        const months = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];
        for (const branch of branches) {
            const row = {
                branchId: branch.id,
                districtName: branch.district?.name || 'Other',
                branchCode: branch.code,
                branchName: branch.name,
                categories: {},
                totalBudget: 0,
                totalActual: 0,
            };
            for (const cat of categories) {
                const b = await this.budgetRepo.findOne({
                    where: { branch: { id: branch.id }, expenseCategory: cat, fiscalYear: fy, status: 'APPROVED' },
                });
                let catBudget = 0;
                let catActual = 0;
                if (b) {
                    const stats = await this.budgetService.computeBudgetStats(b);
                    const factor = b.annualAmount > 0 ? (stats.currentBudget / b.annualAmount) : 1;
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
    async getExceptionReport(fiscalYear, monthStr, level, targetId) {
        const bva = await this.getBvaReport(fiscalYear, level, targetId, monthStr);
        return bva.filter(row => {
            if (row.ytdBudget === 0)
                return false;
            const dev = row.ytdUtilizationPct;
            return dev > 105 || dev < 95;
        });
    }
};
exports.OpexReportController = OpexReportController;
__decorate([
    (0, common_1.Get)('bva'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __param(1, (0, common_1.Query)('level')),
    __param(2, (0, common_1.Query)('targetId')),
    __param(3, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], OpexReportController.prototype, "getBvaReport", null);
__decorate([
    (0, common_1.Get)('bva/export'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __param(1, (0, common_1.Query)('level')),
    __param(2, (0, common_1.Query)('targetId')),
    __param(3, (0, common_1.Query)('month')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], OpexReportController.prototype, "exportBva", null);
__decorate([
    (0, common_1.Get)('branches'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OpexReportController.prototype, "getBranchCategoryReport", null);
__decorate([
    (0, common_1.Get)('exception'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('level')),
    __param(3, (0, common_1.Query)('targetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], OpexReportController.prototype, "getExceptionReport", null);
exports.OpexReportController = OpexReportController = __decorate([
    (0, common_1.Controller)('opex-reports'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(1, (0, typeorm_1.InjectRepository)(opex_budget_entity_1.OpexBudget)),
    __param(2, (0, typeorm_1.InjectRepository)(core_banking_entity_1.CoreBankingTransaction)),
    __param(3, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(4, (0, typeorm_1.InjectRepository)(district_entity_1.District)),
    __param(5, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __metadata("design:paramtypes", [opex_service_1.OpexBudgetService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OpexReportController);
//# sourceMappingURL=opex-report.controller.js.map