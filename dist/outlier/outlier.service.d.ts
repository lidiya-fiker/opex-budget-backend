import { Repository } from 'typeorm';
import { OutlierDefinition } from '../entities/outlier-definition.entity';
export declare class OutlierService {
    private readonly repo;
    constructor(repo: Repository<OutlierDefinition>);
    create(data: Partial<OutlierDefinition>): Promise<OutlierDefinition>;
    findAll(): Promise<OutlierDefinition[]>;
    findByCategory(category: string): Promise<OutlierDefinition[]>;
    evaluate(category: string, value: number, context?: Record<string, any>): Promise<boolean>;
}
