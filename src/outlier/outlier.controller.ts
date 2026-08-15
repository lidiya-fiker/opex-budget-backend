import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OutlierService } from './outlier.service';
import { OutlierDefinition } from '../entities/outlier-definition.entity';

@Controller('outliers')
export class OutlierController {
  constructor(private readonly service: OutlierService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('by-category')
  findByCategory(@Query('category') category: string) {
    return this.service.findByCategory(category);
  }

  @Post()
  create(@Body() body: Partial<OutlierDefinition>) {
    return this.service.create(body);
  }

  // POST /outliers/evaluate  — check if a value is an outlier
  // Body: { category, value, context? }
  @Post('evaluate')
  evaluate(@Body() body: { category: string; value: number; context?: Record<string, any> }) {
    return this.service.evaluate(body.category, body.value, body.context);
  }
}
