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
exports.OpexTransferRequest = void 0;
const typeorm_1 = require("typeorm");
const opex_budget_entity_1 = require("./opex-budget.entity");
const user_entity_1 = require("./user.entity");
let OpexTransferRequest = class OpexTransferRequest {
    id;
    fiscalYear;
    requestType;
    fromBudget;
    toBudget;
    amount;
    remark;
    status;
    createdBy;
    resolvedBy;
    resolvedAt;
    returnRemark;
    createdAt;
};
exports.OpexTransferRequest = OpexTransferRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OpexTransferRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OpexTransferRequest.prototype, "fiscalYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], OpexTransferRequest.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => opex_budget_entity_1.OpexBudget, { nullable: true, eager: true }),
    __metadata("design:type", Object)
], OpexTransferRequest.prototype, "fromBudget", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => opex_budget_entity_1.OpexBudget, { eager: true }),
    __metadata("design:type", opex_budget_entity_1.OpexBudget)
], OpexTransferRequest.prototype, "toBudget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], OpexTransferRequest.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], OpexTransferRequest.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'PENDING' }),
    __metadata("design:type", String)
], OpexTransferRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], OpexTransferRequest.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, eager: true }),
    __metadata("design:type", Object)
], OpexTransferRequest.prototype, "resolvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], OpexTransferRequest.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], OpexTransferRequest.prototype, "returnRemark", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OpexTransferRequest.prototype, "createdAt", void 0);
exports.OpexTransferRequest = OpexTransferRequest = __decorate([
    (0, typeorm_1.Entity)('opex_transfer_requests')
], OpexTransferRequest);
//# sourceMappingURL=opex-transfer-request.entity.js.map