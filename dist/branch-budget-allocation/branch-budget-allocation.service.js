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
var BranchBudgetAllocationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchBudgetAllocationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const branch_budget_allocation_entity_1 = require("../entities/branch-budget-allocation.entity");
const branch_entity_1 = require("../entities/branch.entity");
const gl_account_entity_1 = require("../entities/gl-account.entity");
const core_banking_entity_1 = require("../entities/core-banking.entity");
const XLSX = __importStar(require("xlsx"));
let BranchBudgetAllocationService = BranchBudgetAllocationService_1 = class BranchBudgetAllocationService {
    allocRepo;
    branchRepo;
    glRepo;
    txRepo;
    logger = new common_1.Logger(BranchBudgetAllocationService_1.name);
    constructor(allocRepo, branchRepo, glRepo, txRepo) {
        this.allocRepo = allocRepo;
        this.branchRepo = branchRepo;
        this.glRepo = glRepo;
        this.txRepo = txRepo;
    }
    async findAll(filters) {
        const qb = this.allocRepo.createQueryBuilder('a')
            .leftJoinAndSelect('a.branch', 'branch')
            .leftJoinAndSelect('branch.district', 'district')
            .leftJoinAndSelect('a.glAccount', 'glAccount');
        if (filters.fiscalYear)
            qb.andWhere('a.fiscalYear = :fy', { fy: filters.fiscalYear });
        if (filters.branchCode)
            qb.andWhere('branch.code = :bCode', { bCode: filters.branchCode });
        if (filters.districtId)
            qb.andWhere('branch.districtId = :dId', { dId: filters.districtId });
        if (filters.bankingType)
            qb.andWhere('a.bankingType = :bt', { bt: filters.bankingType });
        if (filters.isBaseline !== undefined)
            qb.andWhere('a.isBaseline = :ib', { ib: filters.isBaseline });
        qb.orderBy('branch.name', 'ASC').addOrderBy('a.glCode', 'ASC');
        return qb.getMany();
    }
    async computeBudgetVsActual(filters) {
        const currentAllocations = await this.findAll({
            fiscalYear: filters.fiscalYear,
            districtId: filters.districtId,
            bankingType: filters.bankingType,
            isBaseline: false,
        });
        const baselineAllocations = filters.baselineYear ? await this.findAll({
            fiscalYear: filters.baselineYear,
            districtId: filters.districtId,
            bankingType: filters.bankingType,
            isBaseline: true,
        }) : [];
        const baselineMap = new Map();
        baselineAllocations.forEach(b => {
            const key = `${b.branch?.code || 'NO_BRANCH'}_${b.glCode}_${b.bankingType}`;
            baselineMap.set(key, Number(b.actualAmount || b.allocatedAmount || 0));
        });
        const results = [];
        for (const alloc of currentAllocations) {
            if (filters.branchId && alloc.branch?.id !== filters.branchId)
                continue;
            if (filters.glCode && alloc.glCode !== filters.glCode)
                continue;
            const key = `${alloc.branch?.code || 'NO_BRANCH'}_${alloc.glCode}_${alloc.bankingType}`;
            const previousYearBaseline = baselineMap.get(key) || 0;
            const txRes = await this.txRepo.createQueryBuilder('tx')
                .select('SUM(tx.amount)', 'totalActual')
                .where('tx.costCenterCode = :cCode', { cCode: alloc.branch?.code })
                .andWhere('tx.glNumber = :gl', { gl: alloc.glCode })
                .andWhere('tx.bankingType = :bt', { bt: alloc.bankingType })
                .andWhere('tx.status = :st', { st: 'MAPPED' })
                .getRawOne();
            const actualAmount = Number(txRes?.totalActual || alloc.actualAmount || 0);
            const allocatedAmount = Number(alloc.allocatedAmount || 0);
            const remainingBudget = allocatedAmount - actualAmount;
            const utilizationPct = allocatedAmount > 0 ? Number(((actualAmount / allocatedAmount) * 100).toFixed(2)) : 0;
            const varianceVsBaseline = previousYearBaseline > 0 ? Number((((actualAmount - previousYearBaseline) / previousYearBaseline) * 100).toFixed(2)) : 0;
            let status = 'NORMAL';
            if (utilizationPct >= 100)
                status = 'OVER-UTILIZED';
            else if (utilizationPct >= 90)
                status = 'WARNING';
            else if (utilizationPct < 40)
                status = 'UNDER-UTILIZED';
            results.push({
                id: alloc.id,
                branchCode: alloc.branch?.code,
                branchName: alloc.branch?.name,
                districtName: alloc.branch?.district?.name,
                glCode: alloc.glCode,
                glDescription: alloc.glDescription,
                bankingType: alloc.bankingType,
                fiscalYear: alloc.fiscalYear,
                allocatedAmount,
                actualAmount,
                remainingBudget,
                utilizationPct,
                previousYearBaseline,
                varianceVsBaseline,
                status,
                monthly: {
                    m1: Number(alloc.m1 || 0), m2: Number(alloc.m2 || 0), m3: Number(alloc.m3 || 0),
                    m4: Number(alloc.m4 || 0), m5: Number(alloc.m5 || 0), m6: Number(alloc.m6 || 0),
                    m7: Number(alloc.m7 || 0), m8: Number(alloc.m8 || 0), m9: Number(alloc.m9 || 0),
                    m10: Number(alloc.m10 || 0), m11: Number(alloc.m11 || 0), m12: Number(alloc.m12 || 0),
                },
            });
        }
        return results;
    }
    async processBudgetAllocationImport(buffer, fiscalYear, isBaseline, bankingTypeDefault = 'CONVENTIONAL') {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
        if (!rows.length)
            throw new common_1.BadRequestException('Uploaded file is empty');
        let inserted = 0;
        let updated = 0;
        const errors = [];
        const branchCache = new Map();
        (await this.branchRepo.find()).forEach(b => branchCache.set(b.code.toUpperCase().trim(), b));
        const glCache = new Map();
        (await this.glRepo.find()).forEach(g => glCache.set(g.glCode.toUpperCase().trim(), g));
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                const branchCode = String(row['Branch Code'] || row['branchCode'] || row['BranchCode'] || row['Code'] || '').toUpperCase().trim();
                const glCode = String(row['GL Code'] || row['glCode'] || row['GL'] || row['GLCode'] || '').trim();
                const glDescription = String(row['GL Description'] || row['glDescription'] || row['Description'] || 'Expense').trim();
                const allocatedAmount = Number(row['Allocated Amount'] || row['Budget'] || row['allocatedAmount'] || row['Amount'] || 0);
                const actualAmount = Number(row['Actual Amount'] || row['Actual'] || row['actualAmount'] || 0);
                const bankingTypeRaw = String(row['Banking Type'] || row['bankingType'] || bankingTypeDefault).toUpperCase();
                const bankingType = bankingTypeRaw.includes('IFB') ? 'IFB' : 'CONVENTIONAL';
                if (!branchCode || !glCode) {
                    errors.push(`Row ${i + 2}: Missing Branch Code or GL Code`);
                    continue;
                }
                const branch = branchCache.get(branchCode);
                if (!branch) {
                    errors.push(`Row ${i + 2}: Branch code ${branchCode} not found in master data`);
                    continue;
                }
                const glAccount = glCache.get(glCode.toUpperCase()) || null;
                const existing = await this.allocRepo.findOne({
                    where: {
                        branch: { id: branch.id },
                        glCode,
                        fiscalYear,
                        bankingType,
                        isBaseline,
                    },
                });
                const splitVal = allocatedAmount / 12;
                if (existing) {
                    existing.allocatedAmount = allocatedAmount;
                    existing.actualAmount = actualAmount;
                    existing.glDescription = glDescription;
                    if (glAccount)
                        existing.glAccount = glAccount;
                    await this.allocRepo.save(existing);
                    updated++;
                }
                else {
                    const newAlloc = this.allocRepo.create({
                        branch,
                        glAccount,
                        glCode,
                        glDescription,
                        fiscalYear,
                        bankingType,
                        allocatedAmount,
                        actualAmount,
                        isBaseline,
                        status: 'APPROVED',
                        m1: Number(row.m1 || splitVal), m2: Number(row.m2 || splitVal), m3: Number(row.m3 || splitVal),
                        m4: Number(row.m4 || splitVal), m5: Number(row.m5 || splitVal), m6: Number(row.m6 || splitVal),
                        m7: Number(row.m7 || splitVal), m8: Number(row.m8 || splitVal), m9: Number(row.m9 || splitVal),
                        m10: Number(row.m10 || splitVal), m11: Number(row.m11 || splitVal), m12: Number(row.m12 || splitVal),
                    });
                    await this.allocRepo.save(newAlloc);
                    inserted++;
                }
            }
            catch (err) {
                errors.push(`Row ${i + 2}: ${err.message}`);
            }
        }
        return { inserted, updated, errors };
    }
};
exports.BranchBudgetAllocationService = BranchBudgetAllocationService;
exports.BranchBudgetAllocationService = BranchBudgetAllocationService = BranchBudgetAllocationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(branch_budget_allocation_entity_1.BranchBudgetAllocation)),
    __param(1, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(2, (0, typeorm_1.InjectRepository)(gl_account_entity_1.GlAccount)),
    __param(3, (0, typeorm_1.InjectRepository)(core_banking_entity_1.CoreBankingTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BranchBudgetAllocationService);
//# sourceMappingURL=branch-budget-allocation.service.js.map