import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManualPayment } from '../entities/manual-payment.entity';
import { ManualPaymentService } from './manual-payment.service';
import { ManualPaymentController } from './manual-payment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ManualPayment])],
  providers: [ManualPaymentService],
  controllers: [ManualPaymentController],
  exports: [ManualPaymentService],
})
export class ManualPaymentModule {}
