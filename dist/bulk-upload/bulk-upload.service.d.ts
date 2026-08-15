import { Repository } from 'typeorm';
import { OpexBudget } from '../entities/opex-budget.entity';
import { Branch } from '../entities/branch.entity';
import { District } from '../entities/district.entity';
import { User } from '../entities/user.entity';
export type UploadType = 'conventional' | 'ifb' | 'supplementary';
export declare class BulkUploadService {
    private readonly opexRepo;
    private readonly branchRepo;
    private readonly districtRepo;
    private readonly userRepo;
    private readonly logger;
    constructor(opexRepo: Repository<OpexBudget>, branchRepo: Repository<Branch>, districtRepo: Repository<District>, userRepo: Repository<User>);
    processUpload(buffer: Buffer, uploadType: UploadType, uploadedBy: number, budgetCycleId?: number): Promise<{
        inserted: number;
        updated: number;
        errors: string[];
    }>;
    processDistrictPivotedUpload(buffer: Buffer, uploadedBy: number, districtName: string, fiscalYear: string): Promise<{
        inserted: number;
        updated: number;
        errors: string[];
    }>;
    private upsertBudgetRow;
}
