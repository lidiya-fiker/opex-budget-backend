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
exports.AlertThresholdController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const alert_threshold_service_1 = require("./alert-threshold.service");
let AlertThresholdController = class AlertThresholdController {
    thresholdService;
    constructor(thresholdService) {
        this.thresholdService = thresholdService;
    }
    async getThresholds() {
        return this.thresholdService.findAll();
    }
    async setThreshold(body) {
        return this.thresholdService.setThreshold(body);
    }
};
exports.AlertThresholdController = AlertThresholdController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertThresholdController.prototype, "getThresholds", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertThresholdController.prototype, "setThreshold", null);
exports.AlertThresholdController = AlertThresholdController = __decorate([
    (0, common_1.Controller)('alert-thresholds'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [alert_threshold_service_1.AlertThresholdService])
], AlertThresholdController);
//# sourceMappingURL=alert-threshold.controller.js.map