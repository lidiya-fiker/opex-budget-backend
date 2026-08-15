"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertThresholdModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const alert_threshold_entity_1 = require("../entities/alert-threshold.entity");
const alert_threshold_service_1 = require("./alert-threshold.service");
const alert_threshold_controller_1 = require("./alert-threshold.controller");
let AlertThresholdModule = class AlertThresholdModule {
};
exports.AlertThresholdModule = AlertThresholdModule;
exports.AlertThresholdModule = AlertThresholdModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([alert_threshold_entity_1.AlertThreshold])],
        providers: [alert_threshold_service_1.AlertThresholdService],
        controllers: [alert_threshold_controller_1.AlertThresholdController],
        exports: [alert_threshold_service_1.AlertThresholdService],
    })
], AlertThresholdModule);
//# sourceMappingURL=alert-threshold.module.js.map