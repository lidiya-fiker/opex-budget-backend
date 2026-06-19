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
exports.OpexBudgetAudit = void 0;
const typeorm_1 = require("typeorm");
const opex_budget_entity_1 = require("./opex-budget.entity");
const user_entity_1 = require("./user.entity");
let OpexBudgetAudit = class OpexBudgetAudit {
    id;
    opexBudget;
    previousAmount;
    newAmount;
    previousAllocations;
    newAllocations;
    modificationType;
    modifiedBy;
    modifiedAt;
};
exports.OpexBudgetAudit = OpexBudgetAudit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OpexBudgetAudit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => opex_budget_entity_1.OpexBudget, { onDelete: 'CASCADE' }),
    __metadata("design:type", opex_budget_entity_1.OpexBudget)
], OpexBudgetAudit.prototype, "opexBudget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], OpexBudgetAudit.prototype, "previousAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], OpexBudgetAudit.prototype, "newAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], OpexBudgetAudit.prototype, "previousAllocations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], OpexBudgetAudit.prototype, "newAllocations", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OpexBudgetAudit.prototype, "modificationType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], OpexBudgetAudit.prototype, "modifiedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OpexBudgetAudit.prototype, "modifiedAt", void 0);
exports.OpexBudgetAudit = OpexBudgetAudit = __decorate([
    (0, typeorm_1.Entity)('opex_budget_audits')
], OpexBudgetAudit);
//# sourceMappingURL=opex-budget-audit.entity.js.map