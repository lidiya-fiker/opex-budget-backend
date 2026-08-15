"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociatedExpenseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const associated_expense_rule_entity_1 = require("../entities/associated-expense-rule.entity");
const associated_expense_service_1 = require("./associated-expense.service");
const associated_expense_controller_1 = require("./associated-expense.controller");
let AssociatedExpenseModule = class AssociatedExpenseModule {
};
exports.AssociatedExpenseModule = AssociatedExpenseModule;
exports.AssociatedExpenseModule = AssociatedExpenseModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([associated_expense_rule_entity_1.AssociatedExpenseRule])],
        providers: [associated_expense_service_1.AssociatedExpenseService],
        controllers: [associated_expense_controller_1.AssociatedExpenseController],
        exports: [associated_expense_service_1.AssociatedExpenseService],
    })
], AssociatedExpenseModule);
//# sourceMappingURL=associated-expense.module.js.map