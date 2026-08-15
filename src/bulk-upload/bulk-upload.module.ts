import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { OpexBudget } from '../entities/opex-budget.entity';
import { Branch } from '../entities/branch.entity';
import { District } from '../entities/district.entity';
import { User } from '../entities/user.entity';
import { BulkUploadService } from './bulk-upload.service';
import { BulkUploadController } from './bulk-upload.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OpexBudget, Branch, District, User]),
    MulterModule.register({ storage: undefined }), // use memory storage (buffer)
  ],
  providers: [BulkUploadService],
  controllers: [BulkUploadController],
  exports: [BulkUploadService],
})
export class BulkUploadModule {}
