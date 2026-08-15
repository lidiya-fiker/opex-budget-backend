import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockedLineItem } from '../entities/locked-line-item.entity';
import { LockedLineItemService } from './locked-line-item.service';
import { LockedLineItemController } from './locked-line-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LockedLineItem])],
  providers: [LockedLineItemService],
  controllers: [LockedLineItemController],
  exports: [LockedLineItemService],
})
export class LockedLineItemModule {}
