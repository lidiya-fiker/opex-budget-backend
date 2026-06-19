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
exports.BudgetItem = void 0;
const typeorm_1 = require("typeorm");
const budget_submission_entity_1 = require("./budget-submission.entity");
const expense_category_entity_1 = require("./expense-category.entity");
let BudgetItem = class BudgetItem {
    id;
    submission;
    category;
    historicalAmount;
    requestedAmount;
    requestedQ1;
    requestedQ2;
    requestedQ3;
    requestedQ4;
    approvedAmount;
    approvedQ1;
    approvedQ2;
    approvedQ3;
    approvedQ4;
    currency;
    exchangeRate;
    justification;
};
exports.BudgetItem = BudgetItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BudgetItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => budget_submission_entity_1.BudgetSubmission, (submission) => submission.items, { onDelete: 'CASCADE' }),
    __metadata("design:type", budget_submission_entity_1.BudgetSubmission)
], BudgetItem.prototype, "submission", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_category_entity_1.ExpenseCategory),
    __metadata("design:type", expense_category_entity_1.ExpenseCategory)
], BudgetItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "historicalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "requestedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "requestedQ1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "requestedQ2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "requestedQ3", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "requestedQ4", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "approvedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "approvedQ1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "approvedQ2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "approvedQ3", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "approvedQ4", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ETB' }),
    __metadata("design:type", String)
], BudgetItem.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4, default: 1 }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BudgetItem.prototype, "justification", void 0);
exports.BudgetItem = BudgetItem = __decorate([
    (0, typeorm_1.Entity)('budget_items')
], BudgetItem);
//# sourceMappingURL=budget-item.entity.js.map