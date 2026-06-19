"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpexModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
const opex_budget_audit_entity_1 = require("../entities/opex-budget-audit.entity");
const opex_transfer_request_entity_1 = require("../entities/opex-transfer-request.entity");
const opex_utilization_request_entity_1 = require("../entities/opex-utilization-request.entity");
const core_banking_entity_1 = require("../entities/core-banking.entity");
const opex_alert_entity_1 = require("../entities/opex-alert.entity");
const department_entity_1 = require("../entities/department.entity");
const branch_entity_1 = require("../entities/branch.entity");
const district_entity_1 = require("../entities/district.entity");
const user_entity_1 = require("../entities/user.entity");
const notification_entity_1 = require("../entities/notification.entity");
const opex_service_1 = require("./opex.service");
const core_banking_service_1 = require("./core-banking.service");
const opex_budget_controller_1 = require("./opex-budget.controller");
const opex_transfer_controller_1 = require("./opex-transfer.controller");
const opex_utilization_controller_1 = require("./opex-utilization.controller");
const core_banking_controller_1 = require("./core-banking.controller");
const opex_report_controller_1 = require("./opex-report.controller");
let OpexModule = class OpexModule {
};
exports.OpexModule = OpexModule;
exports.OpexModule = OpexModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                opex_budget_entity_1.OpexBudget,
                opex_budget_audit_entity_1.OpexBudgetAudit,
                opex_transfer_request_entity_1.OpexTransferRequest,
                opex_utilization_request_entity_1.OpexUtilizationRequest,
                core_banking_entity_1.CoreBankingTransaction,
                core_banking_entity_1.CoreBankingLog,
                opex_alert_entity_1.OpexAlert,
                department_entity_1.Department,
                branch_entity_1.Branch,
                district_entity_1.District,
                user_entity_1.User,
                notification_entity_1.Notification,
            ]),
        ],
        providers: [opex_service_1.OpexBudgetService, core_banking_service_1.CoreBankingService],
        controllers: [
            opex_budget_controller_1.OpexBudgetController,
            opex_transfer_controller_1.OpexTransferController,
            opex_utilization_controller_1.OpexUtilizationController,
            core_banking_controller_1.CoreBankingController,
            opex_report_controller_1.OpexReportController,
        ],
        exports: [opex_service_1.OpexBudgetService, core_banking_service_1.CoreBankingService],
    })
], OpexModule);
//# sourceMappingURL=opex.module.js.map