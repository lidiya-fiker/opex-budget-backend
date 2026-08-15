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
exports.BranchMisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const branch_mis_mapping_entity_1 = require("../entities/branch-mis-mapping.entity");
let BranchMisService = class BranchMisService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll() {
        return this.repo.find({ order: { branchCode: 'ASC' } });
    }
    async findActive() {
        return this.repo.find({ where: { isActive: true } });
    }
    async findClosed() {
        return this.repo.find({ where: { isActive: false } });
    }
    async upsert(data) {
        const existing = await this.repo.findOne({ where: { branchCode: data.branchCode } });
        if (existing) {
            Object.assign(existing, data);
            return this.repo.save(existing);
        }
        return this.repo.save(this.repo.create(data));
    }
    async closeUnit(branchCode) {
        const unit = await this.repo.findOne({ where: { branchCode } });
        if (!unit)
            throw new Error(`Unit ${branchCode} not found`);
        unit.isActive = false;
        unit.closedAt = new Date();
        return this.repo.save(unit);
    }
    async resolveCode(misCodeOrBranchCode) {
        const mapping = await this.repo.findOne({
            where: [
                { branchCode: misCodeOrBranchCode },
                { misCode: misCodeOrBranchCode }
            ]
        });
        return mapping ? mapping.branchCode : misCodeOrBranchCode;
    }
    async findMapping(misCodeOrBranchCode) {
        return this.repo.findOne({
            where: [
                { branchCode: misCodeOrBranchCode },
                { misCode: misCodeOrBranchCode }
            ]
        });
    }
};
exports.BranchMisService = BranchMisService;
exports.BranchMisService = BranchMisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(branch_mis_mapping_entity_1.BranchMisMapping)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BranchMisService);
//# sourceMappingURL=branch-mis.service.js.map