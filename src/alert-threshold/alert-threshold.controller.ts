import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlertThresholdService } from './alert-threshold.service';

@Controller('alert-thresholds')
@UseGuards(AuthGuard('jwt'))
export class AlertThresholdController {
  constructor(private readonly thresholdService: AlertThresholdService) {}

  @Get()
  async getThresholds() {
    return this.thresholdService.findAll();
  }

  @Post()
  async setThreshold(
    @Body()
    body: {
      level: 'BANKWIDE' | 'DISTRICT' | 'BRANCH' | 'GL';
      targetCode?: string;
      overUtilizationPct: number;
      warningPct: number;
      underUtilizationPct: number;
    },
  ) {
    return this.thresholdService.setThreshold(body);
  }
}
