import { Injectable } from '@nestjs/common';

/**
 * FUTURE PHASE — Pro Forma Financial Statement Generation
 * Generates Income Statement, Balance Sheet, Cash Flow, and Key Ratios
 * after consolidation of OPEX + Revenue-side forecasts.
 */
@Injectable()
export class ProFormaService {
  async getIncomeStatement(fiscalYear: string) {
    return {
      statement: 'PRO_FORMA_INCOME_STATEMENT',
      fiscalYear,
      status: 'FUTURE_PHASE',
      message: 'Available after revenue-side forecasting (Phase 2).',
      sections: ['Revenue', 'Operating Expenses (OPEX)', 'Net Income'],
    };
  }

  async getBalanceSheet(fiscalYear: string) {
    return {
      statement: 'PRO_FORMA_BALANCE_SHEET',
      fiscalYear,
      status: 'FUTURE_PHASE',
      message: 'Available after revenue-side forecasting (Phase 2).',
      sections: ['Assets', 'Liabilities', 'Equity'],
    };
  }

  async getCashFlowStatement(fiscalYear: string) {
    return {
      statement: 'PRO_FORMA_CASH_FLOW',
      fiscalYear,
      status: 'FUTURE_PHASE',
      message: 'Available after revenue-side forecasting (Phase 2).',
      sections: ['Cash Inflows', 'Cash Outflows', 'Net Cash Position'],
    };
  }

  async getKeyRatios(fiscalYear: string) {
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
}
