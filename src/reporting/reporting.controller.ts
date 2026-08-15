import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import type { ReportLevel } from './reporting.service';
import * as express from 'express';

@Controller('reports')
export class ReportingController {
  constructor(private readonly service: ReportingService) {}

  /**
   * GET /reports/bva?level=BANK&cycleId=1&unitId=5
   * Levels: BANK | CHIEF | HO | DISTRICT | BRANCH | BUDGET_OWNER
   */
  @Get('bva')
  getBva(
    @Query('level') level: ReportLevel,
    @Query('cycleId') cycleId: number,
    @Query('unitId') unitId: number,
  ) {
    return this.service.getBvaReport(level, Number(unitId) || undefined, Number(cycleId) || undefined);
  }

  /**
   * GET /reports/bva/export?level=BANK&cycleId=1&unitId=5
   */
  @Get('bva/export')
  async exportBva(
    @Query('level') level: ReportLevel,
    @Query('cycleId') cycleId: number,
    @Query('unitId') unitId: number,
    @Res() res: express.Response,
  ) {
    const buffer = await this.service.exportBvaReport(level, Number(unitId) || undefined, Number(cycleId) || undefined);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="bva-report-${level.toLowerCase()}.xlsx"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  /**
   * GET /reports/dashboard/manual-payments
   * BCC dashboard — grouped summary of Capex, AMC, Professional Services, Training
   */
  @Get('dashboard/manual-payments')
  getManualPaymentDashboard() {
    return this.service.getManualPaymentDashboard();
  }
}
