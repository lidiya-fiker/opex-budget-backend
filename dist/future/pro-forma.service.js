"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProFormaService = void 0;
const common_1 = require("@nestjs/common");
let ProFormaService = class ProFormaService {
    async getIncomeStatement(fiscalYear) {
        return {
            statement: 'PRO_FORMA_INCOME_STATEMENT',
            fiscalYear,
            status: 'FUTURE_PHASE',
            message: 'Available after revenue-side forecasting (Phase 2).',
            sections: ['Revenue', 'Operating Expenses (OPEX)', 'Net Income'],
        };
    }
    async getBalanceSheet(fiscalYear) {
        return {
            statement: 'PRO_FORMA_BALANCE_SHEET',
            fiscalYear,
            status: 'FUTURE_PHASE',
            message: 'Available after revenue-side forecasting (Phase 2).',
            sections: ['Assets', 'Liabilities', 'Equity'],
        };
    }
    async getCashFlowStatement(fiscalYear) {
        return {
            statement: 'PRO_FORMA_CASH_FLOW',
            fiscalYear,
            status: 'FUTURE_PHASE',
            message: 'Available after revenue-side forecasting (Phase 2).',
            sections: ['Cash Inflows', 'Cash Outflows', 'Net Cash Position'],
        };
    }
    async getKeyRatios(fiscalYear) {
        return {
            statement: 'KEY_FINANCIAL_RATIOS',
            fiscalYear,
            status: 'FUTURE_PHASE',
            message: 'Available after revenue-side forecasting (Phase 2).',
            ratios: {
                CIR: 'Cost-to-Income Ratio',
                NIM: 'Net Interest Margin',
                CAR: 'Capital Adequacy Ratio',
                LDR: 'Loan-to-Deposit Ratio',
            },
        };
    }
};
exports.ProFormaService = ProFormaService;
exports.ProFormaService = ProFormaService = __decorate([
    (0, common_1.Injectable)()
], ProFormaService);
//# sourceMappingURL=pro-forma.service.js.map