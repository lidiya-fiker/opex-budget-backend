import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { District } from '../entities/district.entity';
import { Branch } from '../entities/branch.entity';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([District, Branch, User, Department])],
  controllers: [AdminController],
})
export class AdminModule {}

