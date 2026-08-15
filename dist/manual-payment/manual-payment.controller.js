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
exports.ManualPaymentController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const manual_payment_service_1 = require("./manual-payment.service");
const create_manual_payment_dto_1 = require("../dto/create-manual-payment.dto");
const user_entity_1 = require("../entities/user.entity");
let ManualPaymentController = class ManualPaymentController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        const requesterId = req.user ? req.user.id : dto.requesterId;
        return this.service.create(dto, requesterId);
    }
    async findAll(req) {
        const payments = await this.service.findAll();
        const role = req.user?.role;
        const fullVisibilityRoles = [
            user_entity_1.Role.BCC_TEAM,
            user_entity_1.Role.BUDGET_OWNER,
            user_entity_1.Role.ADMIN,
            user_entity_1.Role.CHIEF_OFFICER,
            user_entity_1.Role.EXECUTIVE,
            user_entity_1.Role.BOARD,
        ];
        return payments.map(payment => {
            const isOwner = payment.requesterId === req.user?.id;
            if (fullVisibilityRoles.includes(role) || isOwner) {
                return payment;
            }
            const { amount, ...scrubbed } = payment;
            return {
                ...scrubbed,
                amount: null,
                _visibility: 'RESTRICTED',
            };
        });
    }
    getDashboardBreakdown() {
        return this.service.getBreakdown();
    }
    approve(id) {
        return this.service.approve(Number(id));
    }
    confirm(token) {
        return this.service.confirm(token);
    }
};
exports.ManualPaymentController = ManualPaymentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_manual_payment_dto_1.CreateManualPaymentDto, Object]),
    __metadata("design:returntype", void 0)
], ManualPaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManualPaymentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('dashboard/breakdown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ManualPaymentController.prototype, "getDashboardBreakdown", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManualPaymentController.prototype, "approve", null);
__decorate([
    (0, common_1.Get)('confirm'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManualPaymentController.prototype, "confirm", null);
exports.ManualPaymentController = ManualPaymentController = __decorate([
    (0, common_1.Controller)('manual-payments'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [manual_payment_service_1.ManualPaymentService])
], ManualPaymentController);
//# sourceMappingURL=manual-payment.controller.js.map