"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitSubmissionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const unit_submission_status_entity_1 = require("../entities/unit-submission-status.entity");
const unit_submission_service_1 = require("./unit-submission.service");
const unit_submission_controller_1 = require("./unit-submission.controller");
let UnitSubmissionModule = class UnitSubmissionModule {
};
exports.UnitSubmissionModule = UnitSubmissionModule;
exports.UnitSubmissionModule = UnitSubmissionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([unit_submission_status_entity_1.UnitSubmissionStatus])],
        providers: [unit_submission_service_1.UnitSubmissionService],
        controllers: [unit_submission_controller_1.UnitSubmissionController],
        exports: [unit_submission_service_1.UnitSubmissionService],
    })
], UnitSubmissionModule);
//# sourceMappingURL=unit-submission.module.js.map