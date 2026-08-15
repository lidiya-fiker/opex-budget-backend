import { BranchMasterService } from './branch-master.service';
export declare class BranchMasterController {
    private readonly branchMasterService;
    constructor(branchMasterService: BranchMasterService);
    getBranches(districtName?: string, region?: string, bankingType?: string, search?: string, isClosed?: string): Promise<import("../entities/branch.entity").Branch[]>;
    getBranchByCode(code: string): Promise<import("../entities/branch.entity").Branch | null>;
    importBranchMaster(file: Express.Multer.File): Promise<{
        inserted: number;
        updated: number;
        errors: string[];
    }>;
    setBranchStatus(code: string, isClosed: boolean): Promise<import("../entities/branch.entity").Branch>;
}
