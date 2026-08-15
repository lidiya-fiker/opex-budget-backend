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
exports.BranchMasterController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
const branch_master_service_1 = require("./branch-master.service");
let BranchMasterController = class BranchMasterController {
    branchMasterService;
    constructor(branchMasterService) {
        this.branchMasterService = branchMasterService;
    }
    async getBranches(districtName, region, bankingType, search, isClosed) {
        return this.branchMasterService.findAll({
            districtName,
            region,
            bankingType,
            search,
            isClosed: isClosed !== undefined ? isClosed === 'true' : undefined,
        });
    }
    async getBranchByCode(code) {
        return this.branchMasterService.findByCode(code);
    }
    async importBranchMaster(file) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        return this.branchMasterService.processBranchMasterImport(file.buffer);
    }
    async setBranchStatus(code, isClosed) {
        return this.branchMasterService.closeBranch(code, isClosed);
    }
};
exports.BranchMasterController = BranchMasterController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('districtName')),
    __param(1, (0, common_1.Query)('region')),
    __param(2, (0, common_1.Query)('bankingType')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('isClosed')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BranchMasterController.prototype, "getBranches", null);
__decorate([
    (0, common_1.Get)(':code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BranchMasterController.prototype, "getBranchByCode", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BranchMasterController.prototype, "importBranchMaster", null);
__decorate([
    (0, common_1.Patch)(':code/status'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Body)('isClosed')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], BranchMasterController.prototype, "setBranchStatus", null);
exports.BranchMasterController = BranchMasterController = __decorate([
    (0, common_1.Controller)('branch-master'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [branch_master_service_1.BranchMasterService])
], BranchMasterController);
//# sourceMappingURL=branch-master.controller.js.map