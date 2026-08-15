import { Controller, Get, Post, Body } from '@nestjs/common';
import { BulkAdjustmentService } from './bulk-adjustment.service';

@Controller('bulk-adjustments')
export class BulkAdjustmentController {
  constructor(private readonly service: BulkAdjustmentService) {}

  // GET /bulk-adjustments  — history of all adjustments
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // POST /bulk-adjustments  — BOD/Admin triggers a reduction
  // Body: { budgetCycleId, percentage, targetGlCodes: [], appliedBy }
  @Post()
  apply(
    @Body()
    body: {
      budgetCycleId: number;
      percentage: number;
      targetGlCodes: string[];
      appliedBy: number;
    },
  ) {
    return this.service.applyReduction(
      body.budgetCycleId,
      body.percentage,
      body.targetGlCodes,
      body.appliedBy,
    );
  }
}
