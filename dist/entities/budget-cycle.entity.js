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
exports.BudgetCycle = void 0;
const typeorm_1 = require("typeorm");
const budget_submission_entity_1 = require("./budget-submission.entity");
let BudgetCycle = class BudgetCycle {
    id;
    fiscalYear;
    startDate;
    endDate;
    submissionDeadline;
    isActive;
    isPublished;
    submissions;
};
exports.BudgetCycle = BudgetCycle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BudgetCycle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BudgetCycle.prototype, "fiscalYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], BudgetCycle.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], BudgetCycle.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], BudgetCycle.prototype, "submissionDeadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BudgetCycle.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BudgetCycle.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => budget_submission_entity_1.BudgetSubmission, (submission) => submission.budgetCycle),
    __metadata("design:type", Array)
], BudgetCycle.prototype, "submissions", void 0);
exports.BudgetCycle = BudgetCycle = __decorate([
    (0, typeorm_1.Entity)('budget_cycles')
], BudgetCycle);
//# sourceMappingURL=budget-cycle.entity.js.map