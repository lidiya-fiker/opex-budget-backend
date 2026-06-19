import { WorkflowService } from '../workflow/workflow.service';
import { CascadeService } from '../workflow/cascade.service';
import type { Request } from 'express';
export declare class DistrictController {
    private readonly workflowService;
    private readonly cascadeService;
    constructor(workflowService: WorkflowService, cascadeService: CascadeService);
    approveStrategy(districtId: string, req: Request): Promise<{
        message: string;
    }>;
    approveExecutive(districtId: string, req: Request): Promise<{
        message: string;
    }>;
    approveBoard(districtId: string, req: Request): Promise<{
        message: string;
    }>;
    runCascade(districtId: string, cycleId: number, req: Request): Promise<{
        message: string;
    }>;
}
