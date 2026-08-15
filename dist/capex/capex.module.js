"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapexModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const capex_business_case_entity_1 = require("../entities/capex-business-case.entity");
const capex_service_1 = require("./capex.service");
const capex_controller_1 = require("./capex.controller");
let CapexModule = class CapexModule {
};
exports.CapexModule = CapexModule;
exports.CapexModule = CapexModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([capex_business_case_entity_1.CapexBusinessCase])],
        providers: [capex_service_1.CapexService],
        controllers: [capex_controller_1.CapexController],
        exports: [capex_service_1.CapexService],
    })
], CapexModule);
//# sourceMappingURL=capex.module.js.map