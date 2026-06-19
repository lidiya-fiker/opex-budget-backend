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
exports.WorkflowAudit = void 0;
const typeorm_1 = require("typeorm");
const budget_submission_entity_1 = require("./budget-submission.entity");
const user_entity_1 = require("./user.entity");
let WorkflowAudit = class WorkflowAudit {
    id;
    submission;
    actionBy;
    actionDate;
    fromStatus;
    toStatus;
    comments;
};
exports.WorkflowAudit = WorkflowAudit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], WorkflowAudit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => budget_submission_entity_1.BudgetSubmission, (submission) => submission.audits, { onDelete: 'CASCADE' }),
    __metadata("design:type", budget_submission_entity_1.BudgetSubmission)
], WorkflowAudit.prototype, "submission", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], WorkflowAudit.prototype, "actionBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WorkflowAudit.prototype, "actionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], WorkflowAudit.prototype, "fromStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], WorkflowAudit.prototype, "toStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkflowAudit.prototype, "comments", void 0);
exports.WorkflowAudit = WorkflowAudit = __decorate([
    (0, typeorm_1.Entity)('workflow_audits')
], WorkflowAudit);
//# sourceMappingURL=workflow-audit.entity.js.map