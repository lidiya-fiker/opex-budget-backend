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
exports.OutlierDefinition = void 0;
const typeorm_1 = require("typeorm");
let OutlierDefinition = class OutlierDefinition {
    id;
    category;
    criteriaJson;
    description;
    createdAt;
};
exports.OutlierDefinition = OutlierDefinition;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OutlierDefinition.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['TREND', 'TARGET', 'CONTRACT', 'NEEDS'] }),
    __metadata("design:type", String)
], OutlierDefinition.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'criteria_json', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], OutlierDefinition.prototype, "criteriaJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], OutlierDefinition.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], OutlierDefinition.prototype, "createdAt", void 0);
exports.OutlierDefinition = OutlierDefinition = __decorate([
    (0, typeorm_1.Entity)('outlier_definitions')
], OutlierDefinition);
//# sourceMappingURL=outlier-definition.entity.js.map