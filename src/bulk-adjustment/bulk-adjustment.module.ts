import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkAdjustment } from '../entities/bulk-adjustment.entity';
import { OpexBudget } from '../entities/opex-budget.entity';
import { BulkAdjustmentService } from './bulk-adjustment.service';
import { BulkAdjustmentController } from './bulk-adjustment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BulkAdjustment, OpexBudget])],
  providers: [BulkAdjustmentService],
  controllers: [BulkAdjustmentController],
  exports: [BulkAdjustmentService],
})
export class BulkAdjustmentModule {}
