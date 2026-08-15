import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlAccount } from '../entities/gl-account.entity';
import { GlAccountService } from './gl-account.service';
import { GlAccountController } from './gl-account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GlAccount])],
  providers: [GlAccountService],
  controllers: [GlAccountController],
  exports: [GlAccountService],
})
export class GlAccountModule {}
