import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertThreshold } from '../entities/alert-threshold.entity';

@Injectable()
export class AlertThresholdService {
  constructor(
    @InjectRepository(AlertThreshold)
    private readonly thresholdRepo: Repository<AlertThreshold>,
  ) {}

  async findAll() {
    return this.thresholdRepo.find({ order: { level: 'ASC', createdAt: 'DESC' } });
  }

  async setThreshold(data: {
    level: 'BANKWIDE' | 'DISTRICT' | 'BRANCH' | 'GL';
    targetCode?: string;
    overUtilizationPct: number;
    warningPct: number;
    underUtilizationPct: number;
  }) {
    const existing = await this.thresholdRepo.findOne({
      where: { level: data.level, targetCode: data.targetCode || null } as any,
    });

    if (existing) {
      existing.overUtilizationPct = data.overUtilizationPct;
      existing.warningPct = data.warningPct;
      existing.underUtilizationPct = data.underUtilizationPct;
      return this.thresholdRepo.save(existing);
    }

    const newThreshold = this.thresholdRepo.create({
      level: data.level,
      targetCode: data.targetCode || null,
      overUtilizationPct: data.overUtilizationPct,
      warningPct: data.warningPct,
      underUtilizationPct: data.underUtilizationPct,
      isActive: true,
    });
    return this.thresholdRepo.save(newThreshold);
  }

  async getEffectiveThreshold(level: 'DISTRICT' | 'BRANCH' | 'GL', targetCode?: string) {
    if (targetCode) {
      const specific = await this.thresholdRepo.findOne({ where: { level, targetCode, isActive: true } });
      if (specific) return specific;
    }
    const bankwide = await this.thresholdRepo.findOne({ where: { level: 'BANKWIDE', isActive: true } });
    if (bankwide) return bankwide;

    return {
      overUtilizationPct: 100.00,
      warningPct: 90.00,
      underUtilizationPct: 40.00,
    };
  }
}
