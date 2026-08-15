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
exports.CapexService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const capex_business_case_entity_1 = require("../entities/capex-business-case.entity");
const CAPEX_THRESHOLD = 25_000_000;
const EVALUATION_CRITERIA = [
    'strategic_alignment',
    'regulatory_compliance',
    'financial_returns',
    'banking_ratio_impact',
    'cost_reference_accuracy',
    'revenue_drivers',
    'cost_efficiency_gains',
    'risk_assessment',
    'technology_feasibility',
    'data_security',
    'customer_impact',
    'competitive_advantage',
    'liquidity_impact',
    'implementation_readiness',
    'vendor_capability',
    'kpi_framework',
    'alternative_options',
    'esg_contribution',
];
let CapexService = class CapexService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(data) {
        if (Number(data.investmentAmount) > CAPEX_THRESHOLD && !data.evaluationJson) {
            data.status = 'FLAGGED_AWAITING_CASE';
        }
        return this.repo.save(this.repo.create(data));
    }
    async findAll() {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const bc = await this.repo.findOne({ where: { id } });
        if (!bc)
            throw new common_1.NotFoundException(`CAPEX business case #${id} not found`);
        return bc;
    }
    async score(id, evaluation) {
        const bc = await this.findOne(id);
        bc.evaluationJson = evaluation;
        const values = Object.values(evaluation);
        bc.totalScore = values.length
            ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
            : 0;
        bc.status = bc.totalScore >= 70 ? 'APPROVED' : 'REJECTED';
        return this.repo.save(bc);
    }
    getCriteria() {
        return EVALUATION_CRITERIA;
    }
};
exports.CapexService = CapexService;
exports.CapexService = CapexService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(capex_business_case_entity_1.CapexBusinessCase)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CapexService);
//# sourceMappingURL=capex.service.js.map