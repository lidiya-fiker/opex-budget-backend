import { OutlierService } from './outlier.service';
import { OutlierDefinition } from '../entities/outlier-definition.entity';
export declare class OutlierController {
    private readonly service;
    constructor(service: OutlierService);
    findAll(): Promise<OutlierDefinition[]>;
    findByCategory(category: string): Promise<OutlierDefinition[]>;
    create(body: Partial<OutlierDefinition>): Promise<OutlierDefinition>;
    evaluate(body: {
        category: string;
        value: number;
        context?: Record<string, any>;
    }): Promise<boolean>;
}
