import { Repository } from 'typeorm';
import { Branch } from '../entities/branch.entity';
import { District } from '../entities/district.entity';
export declare class BranchMasterService {
    private readonly branchRepo;
    private readonly districtRepo;
    private readonly logger;
    constructor(branchRepo: Repository<Branch>, districtRepo: Repository<District>);
    findAll(filters: {
        districtName?: string;
        region?: string;
        bankingType?: string;
        search?: string;
        isClosed?: boolean;
    }): Promise<Branch[]>;
    findByCode(code: string): Promise<Branch | null>;
    processBranchMasterImport(buffer: Buffer): Promise<{
        inserted: number;
        updated: number;
        errors: string[];
    }>;
    closeBranch(code: string, isClosed?: boolean): Promise<Branch>;
}
