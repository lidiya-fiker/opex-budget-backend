"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchBudgetAllocationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const branch_budget_allocation_entity_1 = require("../entities/branch-budget-allocation.entity");
const branch_entity_1 = require("../entities/branch.entity");
const gl_account_entity_1 = require("../entities/gl-account.entity");
const core_banking_entity_1 = require("../entities/core-banking.entity");
const branch_budget_allocation_service_1 = require("./branch-budget-allocation.service");
const branch_budget_allocation_controller_1 = require("./branch-budget-allocation.controller");
let BranchBudgetAllocationModule = class BranchBudgetAllocationModule {
};
exports.BranchBudgetAllocationModule = BranchBudgetAllocationModule;
exports.BranchBudgetAllocationModule = BranchBudgetAllocationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([branch_budget_allocation_entity_1.BranchBudgetAllocation, branch_entity_1.Branch, gl_account_entity_1.GlAccount, core_banking_entity_1.CoreBankingTransaction]),
        ],
        providers: [branch_budget_allocation_service_1.BranchBudgetAllocationService],
        controllers: [branch_budget_allocation_controller_1.BranchBudgetAllocationController],
        exports: [branch_budget_allocation_service_1.BranchBudgetAllocationService],
    })
], BranchBudgetAllocationModule);
//# sourceMappingURL=branch-budget-allocation.module.js.map