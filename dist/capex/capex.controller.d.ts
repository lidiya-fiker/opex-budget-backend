import { CapexService } from './capex.service';
import { CapexBusinessCase } from '../entities/capex-business-case.entity';
export declare class CapexController {
    private readonly service;
    constructor(service: CapexService);
    getCriteria(): string[];
    findAll(): Promise<CapexBusinessCase[]>;
    findOne(id: number): Promise<CapexBusinessCase>;
    create(body: Partial<CapexBusinessCase>): Promise<CapexBusinessCase>;
    score(id: number, evaluation: Record<string, number>): Promise<CapexBusinessCase>;
}
