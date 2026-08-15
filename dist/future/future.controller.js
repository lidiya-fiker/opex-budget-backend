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
exports.FutureController = void 0;
const common_1 = require("@nestjs/common");
const revenue_forecast_service_1 = require("./revenue-forecast.service");
const pro_forma_service_1 = require("./pro-forma.service");
let FutureController = class FutureController {
    revenueService;
    proFormaService;
    constructor(revenueService, proFormaService) {
        this.revenueService = revenueService;
        this.proFormaService = proFormaService;
    }
    getLoan(fy) { return this.revenueService.getLoanForecast(fy); }
    getInvestment(fy) { return this.revenueService.getInvestmentIncomeForecast(fy); }
    getFx(fy) { return this.revenueService.getFxIncomeForecast(fy); }
    getFees(fy) { return this.revenueService.getFeeForecast(fy); }
    getOther(fy) { return this.revenueService.getOtherIncomeForecast(fy); }
    getIncome(fy) { return this.proFormaService.getIncomeStatement(fy); }
    getBalance(fy) { return this.proFormaService.getBalanceSheet(fy); }
    getCashFlow(fy) { return this.proFormaService.getCashFlowStatement(fy); }
    getRatios(fy) { return this.proFormaService.getKeyRatios(fy); }
};
exports.FutureController = FutureController;
__decorate([
    (0, common_1.Get)('revenue/loan'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FutureController.prototype, "getLoan", null);
__decorate([
    (0, common_1.Get)('revenue/investment'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FutureController.prototype, "getInvestment", null);
__decorate([
    (0, common_1.Get)('revenue/fx'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FutureController.prototype, "getFx", null);
__decorate([
    (0, common_1.Get)('revenue/fees'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FutureController.prototype, "getFees", null);
__decorate([
    (0, common_1.Get)('revenue/other'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FutureController.prototype, "getOther", null);
__decorate([
    (0, common_1.Get)('pro-forma/income-statement'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FutureController.prototype, "getIncome", null);
__decorate([
    (0, common_1.Get)('pro-forma/balance-sheet'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FutureController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('pro-forma/cash-flow'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FutureController.prototype, "getCashFlow", null);
__decorate([
    (0, common_1.Get)('pro-forma/ratios'),
    __param(0, (0, common_1.Query)('fiscalYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FutureController.prototype, "getRatios", null);
exports.FutureController = FutureController = __decorate([
    (0, common_1.Controller)('future'),
    __metadata("design:paramtypes", [revenue_forecast_service_1.RevenueForecastService,
        pro_forma_service_1.ProFormaService])
], FutureController);
//# sourceMappingURL=future.controller.js.map