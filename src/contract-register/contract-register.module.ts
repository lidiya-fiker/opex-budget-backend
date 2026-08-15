import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractRegister } from '../entities/contract-register.entity';
import { ContractRegisterService } from './contract-register.service';
import { ContractRegisterController } from './contract-register.controller';
import { ManualPaymentModule } from '../manual-payment/manual-payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContractRegister]), ManualPaymentModule],
  providers: [ContractRegisterService],
  controllers: [ContractRegisterController],
  exports: [ContractRegisterService],
})
export class ContractRegisterModule {}
