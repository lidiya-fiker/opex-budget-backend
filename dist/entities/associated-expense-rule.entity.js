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
exports.AssociatedExpenseRule = void 0;
const typeorm_1 = require("typeorm");
let AssociatedExpenseRule = class AssociatedExpenseRule {
    id;
    mainAccountCode;
    linkedAccountCode;
    percentage;
    description;
    createdAt;
};
exports.AssociatedExpenseRule = AssociatedExpenseRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssociatedExpenseRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'main_account_code' }),
    __metadata("design:type", String)
], AssociatedExpenseRule.prototype, "mainAccountCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'linked_account_code' }),
    __metadata("design:type", String)
], AssociatedExpenseRule.prototype, "linkedAccountCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'percentage', type: 'numeric', precision: 6, scale: 4 }),
    __metadata("design:type", Number)
], AssociatedExpenseRule.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssociatedExpenseRule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AssociatedExpenseRule.prototype, "createdAt", void 0);
exports.AssociatedExpenseRule = AssociatedExpenseRule = __decorate([
    (0, typeorm_1.Entity)('associated_expense_rules')
], AssociatedExpenseRule);
//# sourceMappingURL=associated-expense-rule.entity.js.map