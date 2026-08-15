import { BranchMisService } from './branch-mis.service';
import { BranchMisMapping } from '../entities/branch-mis-mapping.entity';
export declare class BranchMisController {
    private readonly service;
    constructor(service: BranchMisService);
    findAll(): Promise<BranchMisMapping[]>;
    findActive(): Promise<BranchMisMapping[]>;
    findClosed(): Promise<BranchMisMapping[]>;
    upsert(body: Partial<BranchMisMapping>): Promise<BranchMisMapping>;
    close(code: string): Promise<BranchMisMapping>;
}
