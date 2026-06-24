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
exports.OpexTransferController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const opex_service_1 = require("./opex.service");
const user_entity_1 = require("../entities/user.entity");
let OpexTransferController = class OpexTransferController {
    budgetService;
    constructor(budgetService) {
        this.budgetService = budgetService;
    }
    async create(body, req) {
        return this.budgetService.createTransferRequest(body, req.user);
    }
    async findAll(status, fiscalYear) {
        return this.budgetService.getTransfers({ status, fiscalYear });
    }
    async resolve(id, body, req) {
        const user = req.user;
        if (user.role !== user_entity_1.Role.BCC_TEAM && user.role !== user_entity_1.Role.ADMIN) {
            throw new common_1.HttpException('No permission to resolve transfers', common_1.HttpStatus.FORBIDDEN);
        }
        return this.budgetService.resolveTransferRequest(id, body.status, body.remark, user);
    }
};
exports.OpexTransferController = OpexTransferController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OpexTransferController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OpexTransferController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':id/resolve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], OpexTransferController.prototype, "resolve", null);
exports.OpexTransferController = OpexTransferController = __decorate([
    (0, common_1.Controller)('opex-transfers'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [opex_service_1.OpexBudgetService])
], OpexTransferController);
//# sourceMappingURL=opex-transfer.controller.js.map