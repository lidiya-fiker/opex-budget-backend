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
exports.UnitSubmissionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const unit_submission_status_entity_1 = require("../entities/unit-submission-status.entity");
let UnitSubmissionService = class UnitSubmissionService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getStatus(budgetCycleId) {
        const all = await this.repo.find({ where: { budgetCycleId } });
        const submitted = all.filter((u) => u.submitted);
        const notSubmitted = all.filter((u) => !u.submitted);
        return { submitted, notSubmitted, total: all.length };
    }
    async markSubmitted(unitId, budgetCycleId) {
        let record = await this.repo.findOne({ where: { unitId, budgetCycleId } });
        if (!record) {
            record = this.repo.create({ unitId, budgetCycleId });
        }
        record.submitted = true;
        record.submissionDate = new Date();
        return this.repo.save(record);
    }
    async syncUnits(units) {
        for (const unit of units) {
            const existing = await this.repo.findOne({
                where: { unitId: unit.unitId, budgetCycleId: unit.budgetCycleId },
            });
            if (!existing) {
                await this.repo.save(this.repo.create(unit));
            }
        }
    }
};
exports.UnitSubmissionService = UnitSubmissionService;
exports.UnitSubmissionService = UnitSubmissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(unit_submission_status_entity_1.UnitSubmissionStatus)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UnitSubmissionService);
//# sourceMappingURL=unit-submission.service.js.map