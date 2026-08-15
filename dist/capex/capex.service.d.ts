import { Repository } from 'typeorm';
import { CapexBusinessCase } from '../entities/capex-business-case.entity';
export declare class CapexService {
    private readonly repo;
    constructor(repo: Repository<CapexBusinessCase>);
    create(data: Partial<CapexBusinessCase>): Promise<CapexBusinessCase>;
    findAll(): Promise<CapexBusinessCase[]>;
    findOne(id: number): Promise<CapexBusinessCase>;
    score(id: number, evaluation: Record<string, number>): Promise<CapexBusinessCase>;
    getCriteria(): string[];
}
