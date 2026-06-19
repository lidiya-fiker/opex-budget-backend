import { OpexBudgetService } from './opex.service';
export declare class OpexUtilizationController {
    private readonly budgetService;
    constructor(budgetService: OpexBudgetService);
    create(body: any, req: any): Promise<import("../entities/opex-utilization-request.entity").OpexUtilizationRequest>;
    findAll(status?: string, branchId?: string, depId?: string, fiscalYear?: string): Promise<import("../entities/opex-utilization-request.entity").OpexUtilizationRequest[]>;
    resolve(id: number, body: {
        status: 'APPROVED' | 'REJECTED' | 'RETURNED';
        remark: string;
    }, req: any): Promise<import("../entities/opex-utilization-request.entity").OpexUtilizationRequest>;
}
