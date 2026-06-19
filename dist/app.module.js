"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const district_controller_1 = require("./district/district.controller");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_config_1 = require("./config/database.config");
const auth_module_1 = require("./auth/auth.module");
const workflow_module_1 = require("./workflow/workflow.module");
const mock_gl_module_1 = require("./mock-gl/mock-gl.module");
const branch_entity_1 = require("./entities/branch.entity");
const district_entity_1 = require("./entities/district.entity");
const user_entity_1 = require("./entities/user.entity");
const expense_category_entity_1 = require("./entities/expense-category.entity");
const budget_cycle_entity_1 = require("./entities/budget-cycle.entity");
const budget_submission_entity_1 = require("./entities/budget-submission.entity");
const budget_item_entity_1 = require("./entities/budget-item.entity");
const workflow_audit_entity_1 = require("./entities/workflow-audit.entity");
const budget_cycle_controller_1 = require("./controllers/budget-cycle.controller");
const budget_submission_controller_1 = require("./controllers/budget-submission.controller");
const expense_category_controller_1 = require("./controllers/expense-category.controller");
const notification_controller_1 = require("./controllers/notification.controller");
const seed_module_1 = require("./seed/seed.module");
const admin_module_1 = require("./admin/admin.module");
const notification_entity_1 = require("./entities/notification.entity");
const department_entity_1 = require("./entities/department.entity");
const opex_budget_entity_1 = require("./entities/opex-budget.entity");
const opex_budget_audit_entity_1 = require("./entities/opex-budget-audit.entity");
const opex_transfer_request_entity_1 = require("./entities/opex-transfer-request.entity");
const opex_utilization_request_entity_1 = require("./entities/opex-utilization-request.entity");
const core_banking_entity_1 = require("./entities/core-banking.entity");
const opex_alert_entity_1 = require("./entities/opex-alert.entity");
const opex_module_1 = require("./opex/opex.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: database_config_1.databaseConfig,
            }),
            typeorm_1.TypeOrmModule.forFeature([
                branch_entity_1.Branch,
                district_entity_1.District,
                user_entity_1.User,
                expense_category_entity_1.ExpenseCategory,
                budget_cycle_entity_1.BudgetCycle,
                budget_submission_entity_1.BudgetSubmission,
                budget_item_entity_1.BudgetItem,
                workflow_audit_entity_1.WorkflowAudit,
                notification_entity_1.Notification,
                department_entity_1.Department,
                opex_budget_entity_1.OpexBudget,
                opex_budget_audit_entity_1.OpexBudgetAudit,
                opex_transfer_request_entity_1.OpexTransferRequest,
                opex_utilization_request_entity_1.OpexUtilizationRequest,
                core_banking_entity_1.CoreBankingTransaction,
                core_banking_entity_1.CoreBankingLog,
                opex_alert_entity_1.OpexAlert,
            ]),
            auth_module_1.AuthModule,
            workflow_module_1.WorkflowModule,
            mock_gl_module_1.MockGlModule,
            seed_module_1.SeedModule,
            admin_module_1.AdminModule,
            opex_module_1.OpexModule,
        ],
        controllers: [app_controller_1.AppController, budget_cycle_controller_1.BudgetCycleController, budget_submission_controller_1.BudgetSubmissionController, expense_category_controller_1.ExpenseCategoryController, district_controller_1.DistrictController, notification_controller_1.NotificationController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map