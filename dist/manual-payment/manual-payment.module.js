"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualPaymentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const manual_payment_entity_1 = require("../entities/manual-payment.entity");
const manual_payment_service_1 = require("./manual-payment.service");
const manual_payment_controller_1 = require("./manual-payment.controller");
let ManualPaymentModule = class ManualPaymentModule {
};
exports.ManualPaymentModule = ManualPaymentModule;
exports.ManualPaymentModule = ManualPaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([manual_payment_entity_1.ManualPayment])],
        providers: [manual_payment_service_1.ManualPaymentService],
        controllers: [manual_payment_controller_1.ManualPaymentController],
        exports: [manual_payment_service_1.ManualPaymentService],
    })
], ManualPaymentModule);
//# sourceMappingURL=manual-payment.module.js.map