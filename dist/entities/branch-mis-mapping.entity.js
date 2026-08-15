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
exports.BranchMisMapping = void 0;
const typeorm_1 = require("typeorm");
let BranchMisMapping = class BranchMisMapping {
    id;
    branchCode;
    misCode;
    branchName;
    districtId;
    unitType;
    isActive;
    openedAt;
    closedAt;
    createdAt;
};
exports.BranchMisMapping = BranchMisMapping;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BranchMisMapping.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_code', unique: true }),
    __metadata("design:type", String)
], BranchMisMapping.prototype, "branchCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mis_code', nullable: true }),
    __metadata("design:type", String)
], BranchMisMapping.prototype, "misCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_name' }),
    __metadata("design:type", String)
], BranchMisMapping.prototype, "branchName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'district_id', nullable: true }),
    __metadata("design:type", Number)
], BranchMisMapping.prototype, "districtId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_type' }),
    __metadata("design:type", String)
], BranchMisMapping.prototype, "unitType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], BranchMisMapping.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'opened_at', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BranchMisMapping.prototype, "openedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closed_at', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BranchMisMapping.prototype, "closedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BranchMisMapping.prototype, "createdAt", void 0);
exports.BranchMisMapping = BranchMisMapping = __decorate([
    (0, typeorm_1.Entity)('branch_mis_mapping')
], BranchMisMapping);
//# sourceMappingURL=branch-mis-mapping.entity.js.map