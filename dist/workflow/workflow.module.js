"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const workflow_service_1 = require("./workflow.service");
const cascade_service_1 = require("./cascade.service");
const budget_submission_entity_1 = require("../entities/budget-submission.entity");
const budget_item_entity_1 = require("../entities/budget-item.entity");
const workflow_audit_entity_1 = require("../entities/workflow-audit.entity");
const user_entity_1 = require("../entities/user.entity");
const notification_entity_1 = require("../entities/notification.entity");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
let WorkflowModule = class WorkflowModule {
};
exports.WorkflowModule = WorkflowModule;
exports.WorkflowModule = WorkflowModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([budget_submission_entity_1.BudgetSubmission, budget_item_entity_1.BudgetItem, workflow_audit_entity_1.WorkflowAudit, user_entity_1.User, notification_entity_1.Notification, opex_budget_entity_1.OpexBudget])],
        providers: [workflow_service_1.WorkflowService, cascade_service_1.CascadeService],
        exports: [workflow_service_1.WorkflowService, cascade_service_1.CascadeService],
    })
], WorkflowModule);
//# sourceMappingURL=workflow.module.js.map