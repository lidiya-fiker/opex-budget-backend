import { Controller, Get, Query } from '@nestjs/common';
import { RevenueForecastService } from './revenue-forecast.service';
import { ProFormaService } from './pro-forma.service';

@Controller('future')
export class FutureController {
  constructor(
    private readonly revenueService: RevenueForecastService,
    private readonly proFormaService: ProFormaService,
  ) {}

  // Revenue Forecasting endpoints
  @Get('revenue/loan')
  getLoan(@Query('fiscalYear') fy: string) { return this.revenueService.getLoanForecast(fy); }

  @Get('revenue/investment')
  getInvestment(@Query('fiscalYear') fy: string) { return this.revenueService.getInvestmentIncomeForecast(fy); }

  @Get('revenue/fx')
  getFx(@Query('fiscalYear') fy: string) { return this.revenueService.getFxIncomeForecast(fy); }

  @Get('revenue/fees')
  getFees(@Query('fiscalYear') fy: string) { return this.revenueService.getFeeForecast(fy); }

  @Get('revenue/other')
  getOther(@Query('fiscalYear') fy: string) { return this.revenueService.getOtherIncomeForecast(fy); }

  // Pro Forma Financial Statement endpoints
  @Get('pro-forma/income-statement')
  getIncome(@Query('fiscalYear') fy: string) { return this.proFormaService.getIncomeStatement(fy); }

  @Get('pro-forma/balance-sheet')
  getBalance(@Query('fiscalYear') fy: string) { return this.proFormaService.getBalanceSheet(fy); }

  @Get('pro-forma/cash-flow')
  getCashFlow(@Query('fiscalYear') fy: string) { return this.proFormaService.getCashFlowStatement(fy); }

  @Get('pro-forma/ratios')
  getRatios(@Query('fiscalYear') fy: string) { return this.proFormaService.getKeyRatios(fy); }
}
