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
exports.BudgetSubmission = exports.SubmissionStatus = void 0;
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("./branch.entity");
const budget_cycle_entity_1 = require("./budget-cycle.entity");
const budget_item_entity_1 = require("./budget-item.entity");
const workflow_audit_entity_1 = require("./workflow-audit.entity");
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["DRAFT"] = "DRAFT";
    SubmissionStatus["SUBMITTED_TO_BRANCH_MANAGER"] = "SUBMITTED_TO_BRANCH_MANAGER";
    SubmissionStatus["BRANCH_APPROVED"] = "BRANCH_APPROVED";
    SubmissionStatus["DISTRICT_REVIEWED"] = "DISTRICT_REVIEWED";
    SubmissionStatus["DISTRICT_APPROVED"] = "DISTRICT_APPROVED";
    SubmissionStatus["BCC_APPROVED"] = "BCC_APPROVED";
    SubmissionStatus["STRATEGY_APPROVED"] = "STRATEGY_APPROVED";
    SubmissionStatus["EXECUTIVE_APPROVED"] = "EXECUTIVE_APPROVED";
    SubmissionStatus["BOARD_APPROVED"] = "BOARD_APPROVED";
    SubmissionStatus["RETURNED"] = "RETURNED";
    SubmissionStatus["RETURNED_TO_DISTRICT"] = "RETURNED_TO_DISTRICT";
    SubmissionStatus["EXCLUDED"] = "EXCLUDED";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
let BudgetSubmission = class BudgetSubmission {
    id;
    branch;
    budgetCycle;
    totalAmount;
    currency;
    exchangeRate;
    status;
    items;
    audits;
    createdAt;
    updatedAt;
};
exports.BudgetSubmission = BudgetSubmission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BudgetSubmission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, (branch) => branch.submissions),
    __metadata("design:type", branch_entity_1.Branch)
], BudgetSubmission.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => budget_cycle_entity_1.BudgetCycle, (cycle) => cycle.submissions),
    __metadata("design:type", budget_cycle_entity_1.BudgetCycle)
], BudgetSubmission.prototype, "budgetCycle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BudgetSubmission.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ETB' }),
    __metadata("design:type", String)
], BudgetSubmission.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4, default: 1 }),
    __metadata("design:type", Number)
], BudgetSubmission.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: SubmissionStatus.DRAFT }),
    __metadata("design:type", String)
], BudgetSubmission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => budget_item_entity_1.BudgetItem, (item) => item.submission, { cascade: true }),
    __metadata("design:type", Array)
], BudgetSubmission.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workflow_audit_entity_1.WorkflowAudit, (audit) => audit.submission),
    __metadata("design:type", Array)
], BudgetSubmission.prototype, "audits", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BudgetSubmission.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BudgetSubmission.prototype, "updatedAt", void 0);
exports.BudgetSubmission = BudgetSubmission = __decorate([
    (0, typeorm_1.Entity)('budget_submissions')
], BudgetSubmission);
//# sourceMappingURL=budget-submission.entity.js.map