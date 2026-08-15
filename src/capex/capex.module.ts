import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapexBusinessCase } from '../entities/capex-business-case.entity';
import { CapexService } from './capex.service';
import { CapexController } from './capex.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CapexBusinessCase])],
  providers: [CapexService],
  controllers: [CapexController],
  exports: [CapexService],
})
export class CapexModule {}
