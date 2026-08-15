"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutlierModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const outlier_definition_entity_1 = require("../entities/outlier-definition.entity");
const outlier_service_1 = require("./outlier.service");
const outlier_controller_1 = require("./outlier.controller");
let OutlierModule = class OutlierModule {
};
exports.OutlierModule = OutlierModule;
exports.OutlierModule = OutlierModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([outlier_definition_entity_1.OutlierDefinition])],
        providers: [outlier_service_1.OutlierService],
        controllers: [outlier_controller_1.OutlierController],
        exports: [outlier_service_1.OutlierService],
    })
], OutlierModule);
//# sourceMappingURL=outlier.module.js.map