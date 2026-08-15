import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchMisMapping } from '../entities/branch-mis-mapping.entity';
import { BranchMisService } from './branch-mis.service';
import { BranchMisController } from './branch-mis.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BranchMisMapping])],
  providers: [BranchMisService],
  controllers: [BranchMisController],
  exports: [BranchMisService],
})
export class BranchMisModule {}
