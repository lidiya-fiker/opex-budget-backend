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
exports.BulkUploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const bulk_upload_service_1 = require("./bulk-upload.service");
let BulkUploadController = class BulkUploadController {
    service;
    constructor(service) {
        this.service = service;
    }
    async uploadDistrictPivoted(file, uploadedBy, districtName, fiscalYear) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        if (!districtName)
            throw new common_1.BadRequestException('districtName is required');
        if (!fiscalYear)
            throw new common_1.BadRequestException('fiscalYear is required');
        return this.service.processDistrictPivotedUpload(file.buffer, Number(uploadedBy), districtName, fiscalYear);
    }
    async upload(type, file, uploadedBy, budgetCycleId) {
        const validTypes = ['conventional', 'ifb', 'supplementary'];
        if (!validTypes.includes(type)) {
            throw new common_1.BadRequestException(`Invalid upload type. Use: ${validTypes.join(', ')}`);
        }
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        return this.service.processUpload(file.buffer, type, Number(uploadedBy), budgetCycleId ? Number(budgetCycleId) : undefined);
    }
};
exports.BulkUploadController = BulkUploadController;
__decorate([
    (0, common_1.Post)('district-pivoted'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('uploadedBy')),
    __param(2, (0, common_1.Body)('districtName')),
    __param(3, (0, common_1.Body)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String]),
    __metadata("design:returntype", Promise)
], BulkUploadController.prototype, "uploadDistrictPivoted", null);
__decorate([
    (0, common_1.Post)(':type'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('uploadedBy')),
    __param(3, (0, common_1.Body)('budgetCycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], BulkUploadController.prototype, "upload", null);
exports.BulkUploadController = BulkUploadController = __decorate([
    (0, common_1.Controller)('bulk-uploads'),
    __metadata("design:paramtypes", [bulk_upload_service_1.BulkUploadService])
], BulkUploadController);
//# sourceMappingURL=bulk-upload.controller.js.map