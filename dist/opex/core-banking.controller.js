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
exports.CoreBankingController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const core_banking_service_1 = require("./core-banking.service");
const core_banking_entity_1 = require("../entities/core-banking.entity");
const user_entity_1 = require("../entities/user.entity");
let CoreBankingController = class CoreBankingController {
    cbService;
    transactionRepo;
    logRepo;
    constructor(cbService, transactionRepo, logRepo) {
        this.cbService = cbService;
        this.transactionRepo = transactionRepo;
        this.logRepo = logRepo;
    }
    async refresh(req) {
        if (req.user.role !== user_entity_1.Role.BCC_TEAM && req.user.role !== user_entity_1.Role.ADMIN) {
            throw new common_1.HttpException('Only BCC staff can refresh core banking data', common_1.HttpStatus.FORBIDDEN);
        }
        return this.cbService.syncTransactions();
    }
    async getLogs() {
        return this.logRepo.find({ order: { id: 'DESC' }, take: 20 });
    }
    async getUnmapped() {
        return this.transactionRepo.find({
            where: { isMapped: false },
            order: { id: 'DESC' },
        });
    }
    async manualMap(id, body, req) {
        if (req.user.role !== user_entity_1.Role.BCC_TEAM && req.user.role !== user_entity_1.Role.ADMIN) {
            throw new common_1.HttpException('Only BCC staff can manually map transactions', common_1.HttpStatus.FORBIDDEN);
        }
        return this.cbService.manualMap(id, body.budgetId);
    }
    async simulate(body, req) {
        const count = body.count || 5;
        const txs = await this.cbService.generateMockTransactions(count, body.fiscalYear);
        await this.cbService.syncTransactions();
        return txs;
    }
};
exports.CoreBankingController = CoreBankingController;
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoreBankingController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoreBankingController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('unmapped'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoreBankingController.prototype, "getUnmapped", null);
__decorate([
    (0, common_1.Post)('map/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], CoreBankingController.prototype, "manualMap", null);
__decorate([
    (0, common_1.Post)('simulate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoreBankingController.prototype, "simulate", null);
exports.CoreBankingController = CoreBankingController = __decorate([
    (0, common_1.Controller)('core-banking'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(1, (0, typeorm_1.InjectRepository)(core_banking_entity_1.CoreBankingTransaction)),
    __param(2, (0, typeorm_1.InjectRepository)(core_banking_entity_1.CoreBankingLog)),
    __metadata("design:paramtypes", [core_banking_service_1.CoreBankingService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CoreBankingController);
//# sourceMappingURL=core-banking.controller.js.map