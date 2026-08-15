"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkAdjustmentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bulk_adjustment_entity_1 = require("../entities/bulk-adjustment.entity");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
const bulk_adjustment_service_1 = require("./bulk-adjustment.service");
const bulk_adjustment_controller_1 = require("./bulk-adjustment.controller");
let BulkAdjustmentModule = class BulkAdjustmentModule {
};
exports.BulkAdjustmentModule = BulkAdjustmentModule;
exports.BulkAdjustmentModule = BulkAdjustmentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([bulk_adjustment_entity_1.BulkAdjustment, opex_budget_entity_1.OpexBudget])],
        providers: [bulk_adjustment_service_1.BulkAdjustmentService],
        controllers: [bulk_adjustment_controller_1.BulkAdjustmentController],
        exports: [bulk_adjustment_service_1.BulkAdjustmentService],
    })
], BulkAdjustmentModule);
//# sourceMappingURL=bulk-adjustment.module.js.map