import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitSubmissionStatus } from '../entities/unit-submission-status.entity';
import { UnitSubmissionService } from './unit-submission.service';
import { UnitSubmissionController } from './unit-submission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UnitSubmissionStatus])],
  providers: [UnitSubmissionService],
  controllers: [UnitSubmissionController],
  exports: [UnitSubmissionService],
})
export class UnitSubmissionModule {}
