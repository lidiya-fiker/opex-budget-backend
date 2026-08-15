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
exports.AlertThresholdService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const alert_threshold_entity_1 = require("../entities/alert-threshold.entity");
let AlertThresholdService = class AlertThresholdService {
    thresholdRepo;
    constructor(thresholdRepo) {
        this.thresholdRepo = thresholdRepo;
    }
    async findAll() {
        return this.thresholdRepo.find({ order: { level: 'ASC', createdAt: 'DESC' } });
    }
    async setThreshold(data) {
        const existing = await this.thresholdRepo.findOne({
            where: { level: data.level, targetCode: data.targetCode || null },
        });
        if (existing) {
            existing.overUtilizationPct = data.overUtilizationPct;
            existing.warningPct = data.warningPct;
            existing.underUtilizationPct = data.underUtilizationPct;
            return this.thresholdRepo.save(existing);
        }
        const newThreshold = this.thresholdRepo.create({
            level: data.level,
            targetCode: data.targetCode || null,
            overUtilizationPct: data.overUtilizationPct,
            warningPct: data.warningPct,
            underUtilizationPct: data.underUtilizationPct,
            isActive: true,
        });
        return this.thresholdRepo.save(newThreshold);
    }
    async getEffectiveThreshold(level, targetCode) {
        if (targetCode) {
            const specific = await this.thresholdRepo.findOne({ where: { level, targetCode, isActive: true } });
            if (specific)
                return specific;
        }
        const bankwide = await this.thresholdRepo.findOne({ where: { level: 'BANKWIDE', isActive: true } });
        if (bankwide)
            return bankwide;
        return {
            overUtilizationPct: 100.00,
            warningPct: 90.00,
            underUtilizationPct: 40.00,
        };
    }
};
exports.AlertThresholdService = AlertThresholdService;
exports.AlertThresholdService = AlertThresholdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alert_threshold_entity_1.AlertThreshold)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AlertThresholdService);
//# sourceMappingURL=alert-threshold.service.js.map