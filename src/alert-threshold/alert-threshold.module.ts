import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertThreshold } from '../entities/alert-threshold.entity';
import { AlertThresholdService } from './alert-threshold.service';
import { AlertThresholdController } from './alert-threshold.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AlertThreshold])],
  providers: [AlertThresholdService],
  controllers: [AlertThresholdController],
  exports: [AlertThresholdService],
})
export class AlertThresholdModule {}
