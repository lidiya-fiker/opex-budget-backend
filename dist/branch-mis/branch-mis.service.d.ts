import { Repository } from 'typeorm';
import { BranchMisMapping } from '../entities/branch-mis-mapping.entity';
export declare class BranchMisService {
    private readonly repo;
    constructor(repo: Repository<BranchMisMapping>);
    findAll(): Promise<BranchMisMapping[]>;
    findActive(): Promise<BranchMisMapping[]>;
    findClosed(): Promise<BranchMisMapping[]>;
    upsert(data: Partial<BranchMisMapping>): Promise<BranchMisMapping>;
    closeUnit(branchCode: string): Promise<BranchMisMapping>;
    resolveCode(misCodeOrBranchCode: string): Promise<string>;
    findMapping(misCodeOrBranchCode: string): Promise<BranchMisMapping | null>;
}
