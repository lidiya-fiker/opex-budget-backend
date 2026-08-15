import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalMatrix } from '../entities/approval-matrix.entity';
import { ApprovalMatrixService } from './approval-matrix.service';
import { ApprovalMatrixController } from './approval-matrix.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalMatrix])],
  providers: [ApprovalMatrixService],
  controllers: [ApprovalMatrixController],
  exports: [ApprovalMatrixService],
})
export class ApprovalMatrixModule {}
