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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkAdjustmentController = void 0;
const common_1 = require("@nestjs/common");
const bulk_adjustment_service_1 = require("./bulk-adjustment.service");
let BulkAdjustmentController = class BulkAdjustmentController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    apply(body) {
        return this.service.applyReduction(body.budgetCycleId, body.percentage, body.targetGlCodes, body.appliedBy);
    }
};
exports.BulkAdjustmentController = BulkAdjustmentController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BulkAdjustmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BulkAdjustmentController.prototype, "apply", null);
exports.BulkAdjustmentController = BulkAdjustmentController = __decorate([
    (0, common_1.Controller)('bulk-adjustments'),
    __metadata("design:paramtypes", [bulk_adjustment_service_1.BulkAdjustmentService])
], BulkAdjustmentController);
//# sourceMappingURL=bulk-adjustment.controller.js.map