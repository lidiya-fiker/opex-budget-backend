import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutlierDefinition } from '../entities/outlier-definition.entity';
import { OutlierService } from './outlier.service';
import { OutlierController } from './outlier.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OutlierDefinition])],
  providers: [OutlierService],
  controllers: [OutlierController],
  exports: [OutlierService],
})
export class OutlierModule {}
