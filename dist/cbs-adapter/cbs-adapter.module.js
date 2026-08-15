"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CbsAdapterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const core_banking_entity_1 = require("../entities/core-banking.entity");
const branch_budget_allocation_entity_1 = require("../entities/branch-budget-allocation.entity");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
const branch_entity_1 = require("../entities/branch.entity");
const gl_account_entity_1 = require("../entities/gl-account.entity");
const opex_alert_entity_1 = require("../entities/opex-alert.entity");
const notification_entity_1 = require("../entities/notification.entity");
const user_entity_1 = require("../entities/user.entity");
const cbs_adapter_service_1 = require("./cbs-adapter.service");
const cbs_adapter_controller_1 = require("./cbs-adapter.controller");
let CbsAdapterModule = class CbsAdapterModule {
};
exports.CbsAdapterModule = CbsAdapterModule;
exports.CbsAdapterModule = CbsAdapterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                core_banking_entity_1.CoreBankingTransaction,
                core_banking_entity_1.CoreBankingLog,
                branch_budget_allocation_entity_1.BranchBudgetAllocation,
                opex_budget_entity_1.OpexBudget,
                branch_entity_1.Branch,
                gl_account_entity_1.GlAccount,
                opex_alert_entity_1.OpexAlert,
                notification_entity_1.Notification,
                user_entity_1.User,
            ]),
        ],
        providers: [cbs_adapter_service_1.CbsAdapterService],
        controllers: [cbs_adapter_controller_1.CbsAdapterController],
        exports: [cbs_adapter_service_1.CbsAdapterService],
    })
], CbsAdapterModule);
//# sourceMappingURL=cbs-adapter.module.js.map