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
exports.BranchBudgetAllocationController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
const branch_budget_allocation_service_1 = require("./branch-budget-allocation.service");
let BranchBudgetAllocationController = class BranchBudgetAllocationController {
    allocService;
    constructor(allocService) {
        this.allocService = allocService;
    }
    async getAllocations(fiscalYear, branchCode, districtId, bankingType, isBaseline) {
        return this.allocService.findAll({
            fiscalYear,
            branchCode,
            districtId: districtId ? parseInt(districtId, 10) : undefined,
            bankingType,
            isBaseline: isBaseline !== undefined ? isBaseline === 'true' : undefined,
        });
    }
    async getBudgetVsActual(fiscalYear, baselineYear, districtId, branchId, bankingType, glCode) {
        if (!fiscalYear)
            throw new common_1.BadRequestException('fiscalYear parameter is required');
        return this.allocService.computeBudgetVsActual({
            fiscalYear,
            baselineYear,
            districtId: districtId ? parseInt(districtId, 10) : undefined,
            branchId: branchId ? parseInt(branchId, 10) : undefined,
            bankingType,
            glCode,
        });
    }
    async importAllocations(file, fiscalYear, isBaseline, bankingType) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        if (!fiscalYear)
            throw new common_1.BadRequestException('fiscalYear is required');
        return this.allocService.processBudgetAllocationImport(file.buffer, fiscalYear, isBaseline === 'true', bankingType || 'CONVENTIONAL');
    }
};
exports.BranchBudgetAllocationController = BranchBudgetAllocationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __param(1, (0, common_1.Query)('branchCode')),
    __param(2, (0, common_1.Query)('districtId')),
    __param(3, (0, common_1.Query)('bankingType')),
    __param(4, (0, common_1.Query)('isBaseline')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BranchBudgetAllocationController.prototype, "getAllocations", null);
__decorate([
    (0, common_1.Get)('bva'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __param(1, (0, common_1.Query)('baselineYear')),
    __param(2, (0, common_1.Query)('districtId')),
    __param(3, (0, common_1.Query)('branchId')),
    __param(4, (0, common_1.Query)('bankingType')),
    __param(5, (0, common_1.Query)('glCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BranchBudgetAllocationController.prototype, "getBudgetVsActual", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('fiscalYear')),
    __param(2, (0, common_1.Body)('isBaseline')),
    __param(3, (0, common_1.Body)('bankingType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], BranchBudgetAllocationController.prototype, "importAllocations", null);
exports.BranchBudgetAllocationController = BranchBudgetAllocationController = __decorate([
    (0, common_1.Controller)('branch-budget-allocations'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [branch_budget_allocation_service_1.BranchBudgetAllocationService])
], BranchBudgetAllocationController);
//# sourceMappingURL=branch-budget-allocation.controller.js.map