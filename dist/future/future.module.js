"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureModule = void 0;
const common_1 = require("@nestjs/common");
const revenue_forecast_service_1 = require("./revenue-forecast.service");
const pro_forma_service_1 = require("./pro-forma.service");
const future_controller_1 = require("./future.controller");
let FutureModule = class FutureModule {
};
exports.FutureModule = FutureModule;
exports.FutureModule = FutureModule = __decorate([
    (0, common_1.Module)({
        providers: [revenue_forecast_service_1.RevenueForecastService, pro_forma_service_1.ProFormaService],
        controllers: [future_controller_1.FutureController],
    })
], FutureModule);
//# sourceMappingURL=future.module.js.map