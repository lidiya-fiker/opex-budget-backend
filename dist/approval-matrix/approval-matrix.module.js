"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalMatrixModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const approval_matrix_entity_1 = require("../entities/approval-matrix.entity");
const approval_matrix_service_1 = require("./approval-matrix.service");
const approval_matrix_controller_1 = require("./approval-matrix.controller");
let ApprovalMatrixModule = class ApprovalMatrixModule {
};
exports.ApprovalMatrixModule = ApprovalMatrixModule;
exports.ApprovalMatrixModule = ApprovalMatrixModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([approval_matrix_entity_1.ApprovalMatrix])],
        providers: [approval_matrix_service_1.ApprovalMatrixService],
        controllers: [approval_matrix_controller_1.ApprovalMatrixController],
        exports: [approval_matrix_service_1.ApprovalMatrixService],
    })
], ApprovalMatrixModule);
//# sourceMappingURL=approval-matrix.module.js.map