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
exports.GlAccountController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
const gl_account_service_1 = require("./gl-account.service");
const gl_account_entity_1 = require("../entities/gl-account.entity");
let GlAccountController = class GlAccountController {
    glService;
    constructor(glService) {
        this.glService = glService;
    }
    async getGlAccounts(bankingType, search) {
        return this.glService.findAll(bankingType, search);
    }
    async getConventionalGls(search) {
        return this.glService.findAll(gl_account_entity_1.BankingType.CONVENTIONAL, search);
    }
    async getIfbGls(search) {
        return this.glService.findAll(gl_account_entity_1.BankingType.IFB, search);
    }
    async importGls(file, bankingType) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        if (!bankingType || (bankingType !== gl_account_entity_1.BankingType.CONVENTIONAL && bankingType !== gl_account_entity_1.BankingType.IFB)) {
            throw new common_1.BadRequestException('Invalid bankingType. Must be CONVENTIONAL or IFB');
        }
        return this.glService.processGlImport(file.buffer, bankingType);
    }
    async createGlAccount(body) {
        return this.glService.create(body);
    }
};
exports.GlAccountController = GlAccountController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('bankingType')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GlAccountController.prototype, "getGlAccounts", null);
__decorate([
    (0, common_1.Get)('conventional'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GlAccountController.prototype, "getConventionalGls", null);
__decorate([
    (0, common_1.Get)('ifb'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GlAccountController.prototype, "getIfbGls", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('bankingType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GlAccountController.prototype, "importGls", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GlAccountController.prototype, "createGlAccount", null);
exports.GlAccountController = GlAccountController = __decorate([
    (0, common_1.Controller)('gl-accounts'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [gl_account_service_1.GlAccountService])
], GlAccountController);
//# sourceMappingURL=gl-account.controller.js.map