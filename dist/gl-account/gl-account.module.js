"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlAccountModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gl_account_entity_1 = require("../entities/gl-account.entity");
const gl_account_service_1 = require("./gl-account.service");
const gl_account_controller_1 = require("./gl-account.controller");
let GlAccountModule = class GlAccountModule {
};
exports.GlAccountModule = GlAccountModule;
exports.GlAccountModule = GlAccountModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([gl_account_entity_1.GlAccount])],
        providers: [gl_account_service_1.GlAccountService],
        controllers: [gl_account_controller_1.GlAccountController],
        exports: [gl_account_service_1.GlAccountService],
    })
], GlAccountModule);
//# sourceMappingURL=gl-account.module.js.map