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
exports.CbsAdapterController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
const cbs_adapter_service_1 = require("./cbs-adapter.service");
let CbsAdapterController = class CbsAdapterController {
    cbsAdapterService;
    constructor(cbsAdapterService) {
        this.cbsAdapterService = cbsAdapterService;
    }
    async ingestTransactions(body) {
        const inputs = Array.isArray(body) ? body : [body];
        if (!inputs.length)
            throw new common_1.BadRequestException('Empty transaction payload');
        return this.cbsAdapterService.processIncomingTransactions(inputs);
    }
    async uploadTemplate(file) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        return this.cbsAdapterService.processTemplateUpload(file.buffer);
    }
    async getUnmapped() {
        return this.cbsAdapterService.getUnmappedTransactions();
    }
    async manualMap(transactionId, allocationId, opexBudgetId) {
        if (!transactionId)
            throw new common_1.BadRequestException('transactionId is required');
        return this.cbsAdapterService.manualMapTransaction(transactionId, allocationId, opexBudgetId);
    }
};
exports.CbsAdapterController = CbsAdapterController;
__decorate([
    (0, common_1.Post)('transactions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CbsAdapterController.prototype, "ingestTransactions", null);
__decorate([
    (0, common_1.Post)('upload-template'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CbsAdapterController.prototype, "uploadTemplate", null);
__decorate([
    (0, common_1.Get)('unmapped'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CbsAdapterController.prototype, "getUnmapped", null);
__decorate([
    (0, common_1.Post)('map-manual'),
    __param(0, (0, common_1.Body)('transactionId')),
    __param(1, (0, common_1.Body)('allocationId')),
    __param(2, (0, common_1.Body)('opexBudgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], CbsAdapterController.prototype, "manualMap", null);
exports.CbsAdapterController = CbsAdapterController = __decorate([
    (0, common_1.Controller)('cbs'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [cbs_adapter_service_1.CbsAdapterService])
], CbsAdapterController);
//# sourceMappingURL=cbs-adapter.controller.js.map