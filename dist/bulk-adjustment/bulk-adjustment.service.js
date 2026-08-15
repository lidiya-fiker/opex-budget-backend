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
exports.BulkAdjustmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bulk_adjustment_entity_1 = require("../entities/bulk-adjustment.entity");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
let BulkAdjustmentService = class BulkAdjustmentService {
    adjustmentRepo;
    opexRepo;
    constructor(adjustmentRepo, opexRepo) {
        this.adjustmentRepo = adjustmentRepo;
        this.opexRepo = opexRepo;
    }
    async applyReduction(budgetCycleId, percentage, targetGlCodes, appliedBy) {
        const qb = this.opexRepo
            .createQueryBuilder('ob')
            .where('ob.budgetCycleId = :cycleId', { cycleId: budgetCycleId });
        if (targetGlCodes && targetGlCodes.length) {
            qb.andWhere('ob.glCode IN (:...codes)', { codes: targetGlCodes });
        }
        const budgets = await qb.getMany();
        const factor = 1 - percentage;
        for (const b of budgets) {
            b.annualAmount = Number((Number(b.annualAmount) * factor).toFixed(2));
        }
        await this.opexRepo.save(budgets);
        await this.adjustmentRepo.save(this.adjustmentRepo.create({
            budgetCycleId,
            adjustmentType: 'PERCENTAGE_REDUCTION',
            targetArea: targetGlCodes,
            percentage,
            appliedBy,
        }));
        return { updated: budgets.length };
    }
    async findAll() {
        return this.adjustmentRepo.find({ order: { appliedAt: 'DESC' } });
    }
};
exports.BulkAdjustmentService = BulkAdjustmentService;
exports.BulkAdjustmentService = BulkAdjustmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bulk_adjustment_entity_1.BulkAdjustment)),
    __param(1, (0, typeorm_1.InjectRepository)(opex_budget_entity_1.OpexBudget)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BulkAdjustmentService);
//# sourceMappingURL=bulk-adjustment.service.js.map