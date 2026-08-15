import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from '../entities/branch.entity';
import { District } from '../entities/district.entity';
import { BranchMasterService } from './branch-master.service';
import { BranchMasterController } from './branch-master.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, District])],
  providers: [BranchMasterService],
  controllers: [BranchMasterController],
  exports: [BranchMasterService],
})
export class BranchMasterModule {}
