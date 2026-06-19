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
exports.OpexBudgetController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const opex_service_1 = require("./opex.service");
const opex_alert_entity_1 = require("../entities/opex-alert.entity");
const user_entity_1 = require("../entities/user.entity");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
let OpexBudgetController = class OpexBudgetController {
    budgetService;
    alertRepo;
    userRepo;
    budgetRepo;
    constructor(budgetService, alertRepo, userRepo, budgetRepo) {
        this.budgetService = budgetService;
        this.alertRepo = alertRepo;
        this.userRepo = userRepo;
        this.budgetRepo = budgetRepo;
    }
    async load(body, req) {
        const user = req.user;
        if (user.role !== user_entity_1.Role.BCC_TEAM && user.role !== user_entity_1.Role.ADMIN) {
            throw new common_1.HttpException('Only BCC staff can load budgets', common_1.HttpStatus.FORBIDDEN);
        }
        return this.budgetService.loadBudget(body, user);
    }
    async findAll(fiscalYear, level, status, branchId, districtId, departmentId) {
        return this.budgetService.findAll({
            fiscalYear,
            level,
            status,
            branchId: branchId ? parseInt(branchId, 10) : undefined,
            districtId: districtId ? parseInt(districtId, 10) : undefined,
            departmentId: departmentId ? parseInt(departmentId, 10) : undefined,
        });
    }
    async getAlerts(status, fiscalYear) {
        const qb = this.alertRepo.createQueryBuilder('a')
            .leftJoinAndSelect('a.opexBudget', 'b')
            .leftJoinAndSelect('b.branch', 'branch')
            .leftJoinAndSelect('b.department', 'dep')
            .leftJoinAndSelect('a.resolvedBy', 'resolvedBy')
            .orderBy('a.id', 'DESC');
        if (status)
            qb.andWhere('a.status = :status', { status });
        if (fiscalYear)
            qb.andWhere('b.fiscalYear = :fiscalYear', { fiscalYear });
        return qb.getMany();
    }
    async resolveAlert(id, body, req) {
        const alert = await this.alertRepo.findOne({
            where: { id },
            relations: ['opexBudget'],
        });
        if (!alert)
            throw new common_1.HttpException('Alert not found', common_1.HttpStatus.NOT_FOUND);
        alert.status = body.status;
        alert.resolutionRemark = body.remark;
        alert.resolvedBy = req.user;
        return this.alertRepo.save(alert);
    }
    async getFiscalYears() {
        const rows = await this.budgetRepo
            .createQueryBuilder('b')
            .select('DISTINCT b.fiscalYear', 'fiscalYear')
            .orderBy('b.fiscalYear', 'ASC')
            .getRawMany();
        return rows.map(r => r.fiscalYear).filter(Boolean);
    }
    async findOne(id) {
        return this.budgetService.findOne(id);
    }
    async update(id, body, req) {
        return this.budgetService.updateBudget(id, body, req.user);
    }
    async resolve(id, body, req) {
        const user = req.user;
        if (user.role !== user_entity_1.Role.BCC_TEAM && user.role !== user_entity_1.Role.ADMIN) {
            throw new common_1.HttpException('Only BCC staff can resolve budget loading requests', common_1.HttpStatus.FORBIDDEN);
        }
        return this.budgetService.resolveBudget(id, body.status, body.remark, user);
    }
};
exports.OpexBudgetController = OpexBudgetController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OpexBudgetController.prototype, "load", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __param(1, (0, common_1.Query)('level')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('branchId')),
    __param(4, (0, common_1.Query)('districtId')),
    __param(5, (0, common_1.Query)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], OpexBudgetController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('alerts'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OpexBudgetController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Post)('alerts/:id/resolve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], OpexBudgetController.prototype, "resolveAlert", null);
__decorate([
    (0, common_1.Get)('fiscal-years'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OpexBudgetController.prototype, "getFiscalYears", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OpexBudgetController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], OpexBudgetController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/resolve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], OpexBudgetController.prototype, "resolve", null);
exports.OpexBudgetController = OpexBudgetController = __decorate([
    (0, common_1.Controller)('opex-budgets'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(1, (0, typeorm_1.InjectRepository)(opex_alert_entity_1.OpexAlert)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(opex_budget_entity_1.OpexBudget)),
    __metadata("design:paramtypes", [opex_service_1.OpexBudgetService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OpexBudgetController);
//# sourceMappingURL=opex-budget.controller.js.map