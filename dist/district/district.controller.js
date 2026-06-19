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
exports.DistrictController = void 0;
const common_1 = require("@nestjs/common");
const workflow_service_1 = require("../workflow/workflow.service");
const cascade_service_1 = require("../workflow/cascade.service");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const user_entity_1 = require("../entities/user.entity");
let DistrictController = class DistrictController {
    workflowService;
    cascadeService;
    constructor(workflowService, cascadeService) {
        this.workflowService = workflowService;
        this.cascadeService = cascadeService;
    }
    async approveStrategy(districtId, req) {
        return { message: `District ${districtId} approved by Strategy` };
    }
    async approveExecutive(districtId, req) {
        return { message: `District ${districtId} approved by Executive` };
    }
    async approveBoard(districtId, req) {
        return { message: `District ${districtId} approved by Board` };
    }
    async runCascade(districtId, cycleId, req) {
        await this.cascadeService.cascadeApprovedBudget(cycleId);
        return { message: `Cascade executed for district ${districtId}, cycle ${cycleId}` };
    }
};
exports.DistrictController = DistrictController;
__decorate([
    (0, common_1.Post)(':id/strategy-approve'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.STRATEGY_OFFICER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DistrictController.prototype, "approveStrategy", null);
__decorate([
    (0, common_1.Post)(':id/executive-approve'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.EXECUTIVE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DistrictController.prototype, "approveExecutive", null);
__decorate([
    (0, common_1.Post)(':id/board-approve'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.BOARD),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DistrictController.prototype, "approveBoard", null);
__decorate([
    (0, common_1.Post)(':id/cascade'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.BOARD),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('cycleId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], DistrictController.prototype, "runCascade", null);
exports.DistrictController = DistrictController = __decorate([
    (0, common_1.Controller)('districts'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService,
        cascade_service_1.CascadeService])
], DistrictController);
//# sourceMappingURL=district.controller.js.map