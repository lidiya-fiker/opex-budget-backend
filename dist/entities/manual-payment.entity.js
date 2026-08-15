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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualPayment = exports.ManualPaymentStatus = void 0;
const typeorm_1 = require("typeorm");
var ManualPaymentStatus;
(function (ManualPaymentStatus) {
    ManualPaymentStatus["PENDING"] = "PENDING";
    ManualPaymentStatus["APPROVED"] = "APPROVED";
    ManualPaymentStatus["REJECTED"] = "REJECTED";
    ManualPaymentStatus["CONFIRMED"] = "CONFIRMED";
})(ManualPaymentStatus || (exports.ManualPaymentStatus = ManualPaymentStatus = {}));
let ManualPayment = class ManualPayment {
    id;
    requesterId;
    budgetCode;
    description;
    amount;
    status;
    paymentType;
    confirmationToken;
    createdAt;
    updatedAt;
};
exports.ManualPayment = ManualPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ManualPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requester_id' }),
    __metadata("design:type", Number)
], ManualPayment.prototype, "requesterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'budget_code' }),
    __metadata("design:type", String)
], ManualPayment.prototype, "budgetCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ManualPayment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], ManualPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ManualPaymentStatus, default: ManualPaymentStatus.PENDING }),
    __metadata("design:type", String)
], ManualPayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, default: 'OTHER' }),
    __metadata("design:type", String)
], ManualPayment.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'confirmation_token', nullable: true, type: 'varchar', length: 64 }),
    __metadata("design:type", Object)
], ManualPayment.prototype, "confirmationToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ManualPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ManualPayment.prototype, "updatedAt", void 0);
exports.ManualPayment = ManualPayment = __decorate([
    (0, typeorm_1.Entity)('manual_payments')
], ManualPayment);
//# sourceMappingURL=manual-payment.entity.js.map