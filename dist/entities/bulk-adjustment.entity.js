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
exports.BulkAdjustment = void 0;
const typeorm_1 = require("typeorm");
let BulkAdjustment = class BulkAdjustment {
    id;
    budgetCycleId;
    adjustmentType;
    targetArea;
    percentage;
    appliedBy;
    appliedAt;
};
exports.BulkAdjustment = BulkAdjustment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BulkAdjustment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'budget_cycle_id' }),
    __metadata("design:type", Number)
], BulkAdjustment.prototype, "budgetCycleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adjustment_type' }),
    __metadata("design:type", String)
], BulkAdjustment.prototype, "adjustmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_area', type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], BulkAdjustment.prototype, "targetArea", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'percentage', type: 'numeric', precision: 6, scale: 4 }),
    __metadata("design:type", Number)
], BulkAdjustment.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applied_by' }),
    __metadata("design:type", Number)
], BulkAdjustment.prototype, "appliedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'applied_at' }),
    __metadata("design:type", Date)
], BulkAdjustment.prototype, "appliedAt", void 0);
exports.BulkAdjustment = BulkAdjustment = __decorate([
    (0, typeorm_1.Entity)('bulk_adjustments')
], BulkAdjustment);
//# sourceMappingURL=bulk-adjustment.entity.js.map