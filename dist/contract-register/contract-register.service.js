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
exports.ContractRegisterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contract_register_entity_1 = require("../entities/contract-register.entity");
const schedule_1 = require("@nestjs/schedule");
const manual_payment_service_1 = require("../manual-payment/manual-payment.service");
let ContractRegisterService = class ContractRegisterService {
    repo;
    manualPaymentService;
    constructor(repo, manualPaymentService) {
        this.repo = repo;
        this.manualPaymentService = manualPaymentService;
    }
    async create(data) {
        const contract = this.repo.create(data);
        return this.repo.save(contract);
    }
    async findAll() {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
    async findActive() {
        return this.repo.find({ where: { status: 'ACTIVE' }, order: { periodEnd: 'ASC' } });
    }
    async findOne(id) {
        const contract = await this.repo.findOne({ where: { id } });
        if (!contract)
            throw new common_1.NotFoundException(`Contract #${id} not found`);
        return contract;
    }
    async update(id, data) {
        await this.findOne(id);
        await this.repo.update(id, data);
        return this.findOne(id);
    }
    async markExpired() {
        await this.repo
            .createQueryBuilder()
            .update(contract_register_entity_1.ContractRegister)
            .set({ status: 'EXPIRED' })
            .where('period_end < :now AND status = :active', { now: new Date(), active: 'ACTIVE' })
            .execute();
    }
    async handleContractAutoProcessing() {
        await this.markExpired();
        const activeContracts = await this.repo.find({ where: { status: 'ACTIVE', contractType: 'AMC' } });
        const now = new Date();
        for (const contract of activeContracts) {
            const timeToExpiry = contract.periodEnd.getTime() - now.getTime();
            const daysToExpiry = timeToExpiry / (1000 * 3600 * 24);
            if (daysToExpiry > 0 && daysToExpiry <= 30) {
                try {
                    await this.manualPaymentService.create({
                        budgetCode: contract.budgetCode || '55010',
                        description: `Auto-generated AMC payment for ${contract.vendorName}`,
                        amount: Number(contract.amount) / 12,
                        paymentType: 'AMC',
                        requesterId: 1,
                    }, 1);
                }
                catch (e) {
                    console.error(`Failed to auto-generate payment for contract ${contract.id}:`, e.message);
                }
            }
        }
    }
};
exports.ContractRegisterService = ContractRegisterService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractRegisterService.prototype, "handleContractAutoProcessing", null);
exports.ContractRegisterService = ContractRegisterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contract_register_entity_1.ContractRegister)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        manual_payment_service_1.ManualPaymentService])
], ContractRegisterService);
//# sourceMappingURL=contract-register.service.js.map