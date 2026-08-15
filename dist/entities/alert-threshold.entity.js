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
exports.AlertThreshold = void 0;
const typeorm_1 = require("typeorm");
let AlertThreshold = class AlertThreshold {
    id;
    level;
    targetCode;
    overUtilizationPct;
    warningPct;
    underUtilizationPct;
    isActive;
    createdAt;
    updatedAt;
};
exports.AlertThreshold = AlertThreshold;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AlertThreshold.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'BANKWIDE' }),
    __metadata("design:type", String)
], AlertThreshold.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], AlertThreshold.prototype, "targetCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 100.00 }),
    __metadata("design:type", Number)
], AlertThreshold.prototype, "overUtilizationPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 90.00 }),
    __metadata("design:type", Number)
], AlertThreshold.prototype, "warningPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 40.00 }),
    __metadata("design:type", Number)
], AlertThreshold.prototype, "underUtilizationPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], AlertThreshold.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AlertThreshold.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AlertThreshold.prototype, "updatedAt", void 0);
exports.AlertThreshold = AlertThreshold = __decorate([
    (0, typeorm_1.Entity)('alert_thresholds')
], AlertThreshold);
//# sourceMappingURL=alert-threshold.entity.js.map