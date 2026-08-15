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
exports.BranchBudgetAllocation = void 0;
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("./branch.entity");
const gl_account_entity_1 = require("./gl-account.entity");
const budget_cycle_entity_1 = require("./budget-cycle.entity");
let BranchBudgetAllocation = class BranchBudgetAllocation {
    id;
    branch;
    glAccount;
    glCode;
    glDescription;
    budgetCycle;
    fiscalYear;
    bankingType;
    allocatedAmount;
    actualAmount;
    m1;
    m2;
    m3;
    m4;
    m5;
    m6;
    m7;
    m8;
    m9;
    m10;
    m11;
    m12;
    isBaseline;
    status;
    createdAt;
    updatedAt;
};
exports.BranchBudgetAllocation = BranchBudgetAllocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, { eager: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.Branch)
], BranchBudgetAllocation.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gl_account_entity_1.GlAccount, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'gl_account_id' }),
    __metadata("design:type", Object)
], BranchBudgetAllocation.prototype, "glAccount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BranchBudgetAllocation.prototype, "glCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BranchBudgetAllocation.prototype, "glDescription", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => budget_cycle_entity_1.BudgetCycle, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'budget_cycle_id' }),
    __metadata("design:type", Object)
], BranchBudgetAllocation.prototype, "budgetCycle", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BranchBudgetAllocation.prototype, "fiscalYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'CONVENTIONAL' }),
    __metadata("design:type", String)
], BranchBudgetAllocation.prototype, "bankingType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "allocatedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "actualAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m3", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m4", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m5", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m6", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m7", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m8", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m9", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m10", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m11", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BranchBudgetAllocation.prototype, "m12", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BranchBudgetAllocation.prototype, "isBaseline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'APPROVED' }),
    __metadata("design:type", String)
], BranchBudgetAllocation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BranchBudgetAllocation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BranchBudgetAllocation.prototype, "updatedAt", void 0);
exports.BranchBudgetAllocation = BranchBudgetAllocation = __decorate([
    (0, typeorm_1.Entity)('branch_budget_allocations')
], BranchBudgetAllocation);
//# sourceMappingURL=branch-budget-allocation.entity.js.map