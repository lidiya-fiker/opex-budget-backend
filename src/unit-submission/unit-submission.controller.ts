import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { UnitSubmissionService } from './unit-submission.service';
import { UnitSubmissionStatus } from '../entities/unit-submission-status.entity';

@Controller('units')
export class UnitSubmissionController {
  constructor(private readonly service: UnitSubmissionService) {}

  // GET /units/submission-status?cycleId=1  — BCC follow-up view
  @Get('submission-status')
  getStatus(@Query('cycleId') cycleId: number) {
    return this.service.getStatus(Number(cycleId));
  }

  // POST /units/submission-status/sync  — Admin seeds unit list for a new cycle
  @Post('submission-status/sync')
  sync(@Body() units: Partial<UnitSubmissionStatus>[]) {
    return this.service.syncUnits(units);
  }

  // POST /units/:id/mark-submitted
  @Post(':id/mark-submitted')
  markSubmitted(
    @Param('id') unitId: number,
    @Body('cycleId') cycleId: number,
  ) {
    return this.service.markSubmitted(Number(unitId), Number(cycleId));
  }
}
