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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpexBudgetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
const opex_budget_audit_entity_1 = require("../entities/opex-budget-audit.entity");
const opex_transfer_request_entity_1 = require("../entities/opex-transfer-request.entity");
const opex_utilization_request_entity_1 = require("../entities/opex-utilization-request.entity");
const core_banking_entity_1 = require("../entities/core-banking.entity");
const user_entity_1 = require("../entities/user.entity");
const branch_entity_1 = require("../entities/branch.entity");
const district_entity_1 = require("../entities/district.entity");
const department_entity_1 = require("../entities/department.entity");
const opex_alert_entity_1 = require("../entities/opex-alert.entity");
const core_banking_service_1 = require("./core-banking.service");
let OpexBudgetService = class OpexBudgetService {
    budgetRepo;
    auditRepo;
    transferRepo;
    utilizationRepo;
    transactionRepo;
    alertRepo;
    coreBankingService;
    branchRepo;
    districtRepo;
    departmentRepo;
    constructor(budgetRepo, auditRepo, transferRepo, utilizationRepo, transactionRepo, alertRepo, coreBankingService, branchRepo, districtRepo, departmentRepo) {
        this.budgetRepo = budgetRepo;
        this.auditRepo = auditRepo;
        this.transferRepo = transferRepo;
        this.utilizationRepo = utilizationRepo;
        this.transactionRepo = transactionRepo;
        this.alertRepo = alertRepo;
        this.coreBankingService = coreBankingService;
        this.branchRepo = branchRepo;
        this.districtRepo = districtRepo;
        this.departmentRepo = departmentRepo;
    }
    async loadBudget(data, user) {
        const budget = this.budgetRepo.create({
            fiscalYear: data.fiscalYear,
            level: data.level,
            glNumber: data.glNumber,
            glDescription: data.glDescription,
            expenseCategory: data.expenseCategory,
            annualAmount: data.annualAmount,
            status: 'APPROVED',
            createdBy: user,
        });
        if (data.branchId)
            budget.branch = await this.branchRepo.findOneBy({ id: data.branchId });
        if (data.districtId)
            budget.district = await this.districtRepo.findOneBy({ id: data.districtId });
        if (data.departmentId)
            budget.department = await this.departmentRepo.findOneBy({ id: data.departmentId });
        if (data.allocationMethod === 'QUARTERLY_EXCEL' && data.q1 !== undefined) {
            const m123 = data.q1 / 3;
            const m456 = (data.q2 || 0) / 3;
            const m789 = (data.q3 || 0) / 3;
            const m101112 = (data.q4 || 0) / 3;
            budget.m1 = m123;
            budget.m2 = m123;
            budget.m3 = m123;
            budget.m4 = m456;
            budget.m5 = m456;
            budget.m6 = m456;
            budget.m7 = m789;
            budget.m8 = m789;
            budget.m9 = m789;
            budget.m10 = m101112;
            budget.m11 = m101112;
            budget.m12 = m101112;
        }
        else if (data.allocationMethod === 'EQUAL_MONTHLY') {
            const splitVal = data.annualAmount / 12;
            budget.m1 = splitVal;
            budget.m2 = splitVal;
            budget.m3 = splitVal;
            budget.m4 = splitVal;
            budget.m5 = splitVal;
            budget.m6 = splitVal;
            budget.m7 = splitVal;
            budget.m8 = splitVal;
            budget.m9 = splitVal;
            budget.m10 = splitVal;
            budget.m11 = splitVal;
            budget.m12 = splitVal;
        }
        else {
            const splitVal = data.annualAmount / 12;
            budget.m1 = data.m1 !== undefined ? data.m1 : splitVal;
            budget.m2 = data.m2 !== undefined ? data.m2 : splitVal;
            budget.m3 = data.m3 !== undefined ? data.m3 : splitVal;
            budget.m4 = data.m4 !== undefined ? data.m4 : splitVal;
            budget.m5 = data.m5 !== undefined ? data.m5 : splitVal;
            budget.m6 = data.m6 !== undefined ? data.m6 : splitVal;
            budget.m7 = data.m7 !== undefined ? data.m7 : splitVal;
            budget.m8 = data.m8 !== undefined ? data.m8 : splitVal;
            budget.m9 = data.m9 !== undefined ? data.m9 : splitVal;
            budget.m10 = data.m10 !== undefined ? data.m10 : splitVal;
            budget.m11 = data.m11 !== undefined ? data.m11 : splitVal;
            budget.m12 = data.m12 !== undefined ? data.m12 : splitVal;
        }
        const savedBudget = await this.budgetRepo.save(budget);
        const audit = this.auditRepo.create({
            opexBudget: savedBudget,
            previousAmount: 0,
            newAmount: savedBudget.annualAmount,
            previousAllocations: JSON.stringify({}),
            newAllocations: JSON.stringify({
                m1: savedBudget.m1, m2: savedBudget.m2, m3: savedBudget.m3, m4: savedBudget.m4,
                m5: savedBudget.m5, m6: savedBudget.m6, m7: savedBudget.m7, m8: savedBudget.m8,
                m9: savedBudget.m9, m10: savedBudget.m10, m11: savedBudget.m11, m12: savedBudget.m12,
            }),
            modificationType: 'INITIAL_LOAD',
            modifiedBy: user,
        });
        await this.auditRepo.save(audit);
        return savedBudget;
    }
    async resolveBudget(id, status, remark, user) {
        const budget = await this.budgetRepo.findOneBy({ id });
        if (!budget)
            throw new common_1.HttpException('Budget not found', common_1.HttpStatus.NOT_FOUND);
        budget.status = status;
        budget.remark = remark;
        return this.budgetRepo.save(budget);
    }
    async updateBudget(id, data, user) {
        const budget = await this.budgetRepo.findOneBy({ id });
        if (!budget)
            throw new common_1.HttpException('Budget not found', common_1.HttpStatus.NOT_FOUND);
        const prevAllocations = {
            m1: budget.m1, m2: budget.m2, m3: budget.m3, m4: budget.m4,
            m5: budget.m5, m6: budget.m6, m7: budget.m7, m8: budget.m8,
            m9: budget.m9, m10: budget.m10, m11: budget.m11, m12: budget.m12,
        };
        const audit = this.auditRepo.create({
            opexBudget: budget,
            previousAmount: budget.annualAmount,
            newAmount: data.annualAmount,
            previousAllocations: JSON.stringify(prevAllocations),
            newAllocations: JSON.stringify(data),
            modificationType: 'MANUAL_EDIT',
            modifiedBy: user,
        });
        budget.annualAmount = data.annualAmount;
        budget.m1 = data.m1;
        budget.m2 = data.m2;
        budget.m3 = data.m3;
        budget.m4 = data.m4;
        budget.m5 = data.m5;
        budget.m6 = data.m6;
        budget.m7 = data.m7;
        budget.m8 = data.m8;
        budget.m9 = data.m9;
        budget.m10 = data.m10;
        budget.m11 = data.m11;
        budget.m12 = data.m12;
        budget.status = 'PENDING';
        await this.auditRepo.save(audit);
        return this.budgetRepo.save(budget);
    }
    async computeBudgetStats(budget) {
        const transInRes = await this.transferRepo.createQueryBuilder('t')
            .select('SUM(t.amount)', 'sum')
            .where('t.toBudgetId = :id AND t.status = :status', { id: budget.id, status: 'APPROVED' })
            .getRawOne();
        const transferredIn = Number(transInRes?.sum || 0);
        const transOutRes = await this.transferRepo.createQueryBuilder('t')
            .select('SUM(t.amount)', 'sum')
            .where('t.fromBudgetId = :id AND t.status = :status', { id: budget.id, status: 'APPROVED' })
            .getRawOne();
        const transferredOut = Number(transOutRes?.sum || 0);
        const currentBudget = Number(budget.annualAmount) + transferredIn - transferredOut;
        const utilRes = await this.utilizationRepo.createQueryBuilder('u')
            .select('SUM(u.amount)', 'sum')
            .where('u.opexBudgetId = :id AND u.status = :status', { id: budget.id, status: 'APPROVED' })
            .getRawOne();
        const committed = Number(utilRes?.sum || 0);
        const pendingUtilRes = await this.utilizationRepo.createQueryBuilder('u')
            .select('SUM(u.amount)', 'sum')
            .where('u.opexBudgetId = :id AND u.status = :status', { id: budget.id, status: 'PENDING' })
            .getRawOne();
        const pendingCommitted = Number(pendingUtilRes?.sum || 0);
        const actRes = await this.transactionRepo.createQueryBuilder('tr')
            .select('SUM(tr.amount)', 'sum')
            .where('tr.mappedBudgetId = :id', { id: budget.id })
            .getRawOne();
        const actuals = Number(actRes?.sum || 0);
        const remaining = currentBudget - actuals;
        const remainingForUtil = currentBudget - committed;
        return {
            transferredIn,
            transferredOut,
            currentBudget,
            committed,
            pendingCommitted,
            actuals,
            remaining,
            remainingForUtil,
        };
    }
    async findAll(user, filters) {
        const qb = this.budgetRepo.createQueryBuilder('b')
            .leftJoinAndSelect('b.branch', 'branch')
            .leftJoinAndSelect('branch.district', 'branchDistrict')
            .leftJoinAndSelect('b.district', 'district')
            .leftJoinAndSelect('b.department', 'department')
            .leftJoinAndSelect('b.createdBy', 'createdBy');
        if (filters.fiscalYear)
            qb.andWhere('b.fiscalYear = :fy', { fy: filters.fiscalYear });
        if (filters.level)
            qb.andWhere('b.level = :level', { level: filters.level });
        if (filters.status)
            qb.andWhere('b.status = :status', { status: filters.status });
        if (filters.branchId)
            qb.andWhere('b.branchId = :branchId', { branchId: filters.branchId });
        if (filters.districtId)
            qb.andWhere('b.districtId = :districtId', { districtId: filters.districtId });
        if (filters.departmentId)
            qb.andWhere('b.departmentId = :depId', { depId: filters.departmentId });
        const u = user;
        if (u.role === user_entity_1.Role.BRANCH_MANAGER || u.role === user_entity_1.Role.BRANCH_USER) {
            qb.andWhere('b.branchId = :userBranchId', { userBranchId: u.branchId });
        }
        else if (u.role === user_entity_1.Role.DISTRICT_MANAGER) {
            qb.andWhere('(b.districtId = :userDistrictId OR branch.districtId = :userDistrictId)', { userDistrictId: u.districtId });
        }
        else if (u.role === user_entity_1.Role.DEPARTMENT_USER) {
            qb.andWhere('b.departmentId = :userDepId', { userDepId: u.departmentId });
        }
        const budgets = await qb.getMany();
        const result = [];
        for (const b of budgets) {
            const stats = await this.computeBudgetStats(b);
            result.push({
                ...b,
                ...stats,
            });
        }
        return result;
    }
    async findOne(id) {
        const budget = await this.budgetRepo.findOne({
            where: { id },
            relations: ['branch', 'district', 'department', 'createdBy'],
        });
        if (!budget)
            throw new common_1.HttpException('Budget not found', common_1.HttpStatus.NOT_FOUND);
        const stats = await this.computeBudgetStats(budget);
        return {
            ...budget,
            ...stats,
        };
    }
    async createTransferRequest(data, user) {
        const toBudget = await this.budgetRepo.findOneBy({ id: data.toBudgetId });
        if (!toBudget)
            throw new common_1.HttpException('Destination budget not found', common_1.HttpStatus.NOT_FOUND);
        let fromBudget = null;
        if (data.requestType === 'TRANSFER') {
            if (!data.fromBudgetId)
                throw new common_1.HttpException('Source budget is required for transfers', common_1.HttpStatus.BAD_REQUEST);
            fromBudget = await this.budgetRepo.findOneBy({ id: data.fromBudgetId });
            if (!fromBudget)
                throw new common_1.HttpException('Source budget not found', common_1.HttpStatus.NOT_FOUND);
            const stats = await this.computeBudgetStats(fromBudget);
            if (stats.remainingForUtil < data.amount) {
                throw new common_1.HttpException('Insufficient balance in source budget', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        const request = this.transferRepo.create({
            fiscalYear: data.fiscalYear,
            requestType: data.requestType,
            fromBudget,
            toBudget,
            amount: data.amount,
            remark: data.remark,
            status: 'PENDING',
            createdBy: user,
        });
        return this.transferRepo.save(request);
    }
    async resolveTransferRequest(id, status, remark, user) {
        const request = await this.transferRepo.findOne({
            where: { id },
            relations: ['fromBudget', 'toBudget'],
        });
        if (!request)
            throw new common_1.HttpException('Transfer request not found', common_1.HttpStatus.NOT_FOUND);
        if (request.status !== 'PENDING') {
            throw new common_1.HttpException('Request already processed', common_1.HttpStatus.BAD_REQUEST);
        }
        request.status = status;
        request.resolvedBy = user;
        request.resolvedAt = new Date();
        request.returnRemark = remark;
        if (status === 'APPROVED') {
            if (request.requestType === 'TRANSFER') {
                const fromStats = await this.computeBudgetStats(request.fromBudget);
                const auditFrom = this.auditRepo.create({
                    opexBudget: request.fromBudget,
                    previousAmount: fromStats.currentBudget,
                    newAmount: fromStats.currentBudget - Number(request.amount),
                    modificationType: 'TRANSFER_OUT',
                    modifiedBy: user,
                });
                await this.auditRepo.save(auditFrom);
            }
            const toStats = await this.computeBudgetStats(request.toBudget);
            const auditTo = this.auditRepo.create({
                opexBudget: request.toBudget,
                previousAmount: toStats.currentBudget,
                newAmount: toStats.currentBudget + Number(request.amount),
                modificationType: request.requestType === 'TRANSFER' ? 'TRANSFER_IN' : 'SUPPLEMENTARY',
                modifiedBy: user,
            });
            await this.auditRepo.save(auditTo);
            await this.transferRepo.save(request);
            if (request.fromBudget) {
                await this.coreBankingService.checkAndCreateAlert(request.fromBudget);
            }
            await this.coreBankingService.checkAndCreateAlert(request.toBudget);
        }
        else {
            await this.transferRepo.save(request);
        }
        return request;
    }
    async getTransfers(filters) {
        const qb = this.transferRepo.createQueryBuilder('t')
            .leftJoinAndSelect('t.fromBudget', 'fromBudget')
            .leftJoinAndSelect('fromBudget.branch', 'fromBranch')
            .leftJoinAndSelect('t.toBudget', 'toBudget')
            .leftJoinAndSelect('toBudget.branch', 'toBranch')
            .leftJoinAndSelect('t.createdBy', 'createdBy')
            .leftJoinAndSelect('t.resolvedBy', 'resolvedBy')
            .orderBy('t.id', 'ASC');
        if (filters.status)
            qb.andWhere('t.status = :status', { status: filters.status });
        if (filters.fiscalYear)
            qb.andWhere('t.fiscalYear = :fy', { fy: filters.fiscalYear });
        return qb.getMany();
    }
    async createUtilizationRequest(data, user) {
        const budget = await this.budgetRepo.findOneBy({ id: data.opexBudgetId });
        if (!budget)
            throw new common_1.HttpException('Budget not found', common_1.HttpStatus.NOT_FOUND);
        const stats = await this.computeBudgetStats(budget);
        if (stats.remainingForUtil < data.amount) {
            throw new common_1.HttpException('Insufficient remaining budget', common_1.HttpStatus.BAD_REQUEST);
        }
        const request = this.utilizationRepo.create({
            opexBudget: budget,
            amount: data.amount,
            description: data.description,
            status: 'PENDING',
            createdBy: user,
        });
        return this.utilizationRepo.save(request);
    }
    async resolveUtilizationRequest(id, status, remark, user) {
        const request = await this.utilizationRepo.findOne({
            where: { id },
            relations: ['opexBudget'],
        });
        if (!request)
            throw new common_1.HttpException('Request not found', common_1.HttpStatus.NOT_FOUND);
        if (request.status !== 'PENDING') {
            throw new common_1.HttpException('Request already resolved', common_1.HttpStatus.BAD_REQUEST);
        }
        request.status = status;
        request.resolvedBy = user;
        request.resolvedAt = new Date();
        request.returnRemark = remark;
        return this.utilizationRepo.save(request);
    }
    async getUtilizations(filters) {
        const qb = this.utilizationRepo.createQueryBuilder('u')
            .leftJoinAndSelect('u.opexBudget', 'b')
            .leftJoinAndSelect('b.branch', 'branch')
            .leftJoinAndSelect('b.department', 'dep')
            .leftJoinAndSelect('u.createdBy', 'createdBy')
            .leftJoinAndSelect('u.resolvedBy', 'resolvedBy')
            .orderBy('u.id', 'ASC');
        if (filters.status)
            qb.andWhere('u.status = :status', { status: filters.status });
        if (filters.branchId)
            qb.andWhere('b.branchId = :branchId', { branchId: filters.branchId });
        if (filters.depId)
            qb.andWhere('b.departmentId = :depId', { depId: filters.depId });
        if (filters.fiscalYear)
            qb.andWhere('b.fiscalYear = :fy', { fy: filters.fiscalYear });
        return qb.getMany();
    }
};
exports.OpexBudgetService = OpexBudgetService;
exports.OpexBudgetService = OpexBudgetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(opex_budget_entity_1.OpexBudget)),
    __param(1, (0, typeorm_1.InjectRepository)(opex_budget_audit_entity_1.OpexBudgetAudit)),
    __param(2, (0, typeorm_1.InjectRepository)(opex_transfer_request_entity_1.OpexTransferRequest)),
    __param(3, (0, typeorm_1.InjectRepository)(opex_utilization_request_entity_1.OpexUtilizationRequest)),
    __param(4, (0, typeorm_1.InjectRepository)(core_banking_entity_1.CoreBankingTransaction)),
    __param(5, (0, typeorm_1.InjectRepository)(opex_alert_entity_1.OpexAlert)),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => core_banking_service_1.CoreBankingService))),
    __param(7, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(8, (0, typeorm_1.InjectRepository)(district_entity_1.District)),
    __param(9, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        core_banking_service_1.CoreBankingService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OpexBudgetService);
//# sourceMappingURL=opex.service.js.map