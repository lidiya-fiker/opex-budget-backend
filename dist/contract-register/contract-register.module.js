"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractRegisterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const contract_register_entity_1 = require("../entities/contract-register.entity");
const contract_register_service_1 = require("./contract-register.service");
const contract_register_controller_1 = require("./contract-register.controller");
const manual_payment_module_1 = require("../manual-payment/manual-payment.module");
let ContractRegisterModule = class ContractRegisterModule {
};
exports.ContractRegisterModule = ContractRegisterModule;
exports.ContractRegisterModule = ContractRegisterModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([contract_register_entity_1.ContractRegister]), manual_payment_module_1.ManualPaymentModule],
        providers: [contract_register_service_1.ContractRegisterService],
        controllers: [contract_register_controller_1.ContractRegisterController],
        exports: [contract_register_service_1.ContractRegisterService],
    })
], ContractRegisterModule);
//# sourceMappingURL=contract-register.module.js.map