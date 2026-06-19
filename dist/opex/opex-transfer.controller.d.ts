import { OpexBudgetService } from './opex.service';
export declare class OpexTransferController {
    private readonly budgetService;
    constructor(budgetService: OpexBudgetService);
    create(body: any, req: any): Promise<import("../entities/opex-transfer-request.entity").OpexTransferRequest>;
    findAll(status?: string, fiscalYear?: string): Promise<import("../entities/opex-transfer-request.entity").OpexTransferRequest[]>;
    resolve(id: number, body: {
        status: 'APPROVED' | 'REJECTED' | 'RETURNED';
        remark: string;
    }, req: any): Promise<import("../entities/opex-transfer-request.entity").OpexTransferRequest>;
}
