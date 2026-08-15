import { Module } from '@nestjs/common';
import { RevenueForecastService } from './revenue-forecast.service';
import { ProFormaService } from './pro-forma.service';
import { FutureController } from './future.controller';

@Module({
  providers: [RevenueForecastService, ProFormaService],
  controllers: [FutureController],
})
export class FutureModule {}
