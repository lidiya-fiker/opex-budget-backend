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
exports.ApprovalMatrix = void 0;
const typeorm_1 = require("typeorm");
let ApprovalMatrix = class ApprovalMatrix {
    id;
    requestType;
    level;
    role;
    isMandatory;
};
exports.ApprovalMatrix = ApprovalMatrix;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ApprovalMatrix.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_type' }),
    __metadata("design:type", String)
], ApprovalMatrix.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'level' }),
    __metadata("design:type", Number)
], ApprovalMatrix.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role' }),
    __metadata("design:type", String)
], ApprovalMatrix.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_mandatory', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ApprovalMatrix.prototype, "isMandatory", void 0);
exports.ApprovalMatrix = ApprovalMatrix = __decorate([
    (0, typeorm_1.Entity)('approval_matrix')
], ApprovalMatrix);
//# sourceMappingURL=approval-matrix.entity.js.map