import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutlierDefinition } from '../entities/outlier-definition.entity';

@Injectable()
export class OutlierService {
  constructor(
    @InjectRepository(OutlierDefinition)
    private readonly repo: Repository<OutlierDefinition>,
  ) {}

  async create(data: Partial<OutlierDefinition>): Promise<OutlierDefinition> {
    return this.repo.save(this.repo.create(data));
  }

  async findAll(): Promise<OutlierDefinition[]> {
    return this.repo.find();
  }

  async findByCategory(category: string): Promise<OutlierDefinition[]> {
    return this.repo.find({ where: { category } });
  }

  /**
   * Evaluate a given value against all outlier definitions for a category.
   * Returns true if value qualifies as an outlier.
   */
  async evaluate(category: string, value: number, context: Record<string, any> = {}): Promise<boolean> {
    const defs = await this.findByCategory(category);
    for (const def of defs) {
      const criteria = def.criteriaJson || {};
      if (criteria.threshold !== undefined && value > criteria.threshold) return true;
      if (criteria.percentAboveAverage !== undefined && context.average !== undefined) {
        if (value > context.average * (1 + criteria.percentAboveAverage)) return true;
      }
    }
    return false;
  }
}
