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
exports.BranchAllocation = void 0;
const typeorm_1 = require("typeorm");
const budget_submission_entity_1 = require("./budget-submission.entity");
const branch_entity_1 = require("./branch.entity");
let BranchAllocation = class BranchAllocation {
    id;
    branch;
    submission;
    allocatedAmount;
    createdAt;
};
exports.BranchAllocation = BranchAllocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BranchAllocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, (branch) => branch.id, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.Branch)
], BranchAllocation.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => budget_submission_entity_1.BudgetSubmission, (sub) => sub.id, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'submission_id' }),
    __metadata("design:type", budget_submission_entity_1.BudgetSubmission)
], BranchAllocation.prototype, "submission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], BranchAllocation.prototype, "allocatedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], BranchAllocation.prototype, "createdAt", void 0);
exports.BranchAllocation = BranchAllocation = __decorate([
    (0, typeorm_1.Entity)('branch_allocation')
], BranchAllocation);
//# sourceMappingURL=branch-allocation.entity.js.map