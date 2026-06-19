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
exports.OpexUtilizationRequest = void 0;
const typeorm_1 = require("typeorm");
const opex_budget_entity_1 = require("./opex-budget.entity");
const user_entity_1 = require("./user.entity");
let OpexUtilizationRequest = class OpexUtilizationRequest {
    id;
    opexBudget;
    amount;
    description;
    status;
    createdBy;
    resolvedBy;
    resolvedAt;
    returnRemark;
    createdAt;
};
exports.OpexUtilizationRequest = OpexUtilizationRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OpexUtilizationRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => opex_budget_entity_1.OpexBudget, { eager: true }),
    __metadata("design:type", opex_budget_entity_1.OpexBudget)
], OpexUtilizationRequest.prototype, "opexBudget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], OpexUtilizationRequest.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], OpexUtilizationRequest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'PENDING' }),
    __metadata("design:type", String)
], OpexUtilizationRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], OpexUtilizationRequest.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, eager: true }),
    __metadata("design:type", Object)
], OpexUtilizationRequest.prototype, "resolvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], OpexUtilizationRequest.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], OpexUtilizationRequest.prototype, "returnRemark", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OpexUtilizationRequest.prototype, "createdAt", void 0);
exports.OpexUtilizationRequest = OpexUtilizationRequest = __decorate([
    (0, typeorm_1.Entity)('opex_utilization_requests')
], OpexUtilizationRequest);
//# sourceMappingURL=opex-utilization-request.entity.js.map