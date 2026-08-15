import { ManualPaymentService } from './manual-payment.service';
import { CreateManualPaymentDto } from '../dto/create-manual-payment.dto';
export declare class ManualPaymentController {
    private readonly service;
    constructor(service: ManualPaymentService);
    create(dto: CreateManualPaymentDto, req: any): Promise<import("../entities/manual-payment.entity").ManualPayment>;
    findAll(req: any): Promise<(import("../entities/manual-payment.entity").ManualPayment | {
        amount: null;
        _visibility: string;
        id: number;
        requesterId: number;
        budgetCode: string;
        description: string;
        status: import("../entities/manual-payment.entity").ManualPaymentStatus;
        paymentType: string;
        confirmationToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getDashboardBreakdown(): Promise<{
        paymentType: string;
        count: number;
        totalAmount: number;
    }[]>;
    approve(id: string): Promise<import("../entities/manual-payment.entity").ManualPayment>;
    confirm(token: string): Promise<import("../entities/manual-payment.entity").ManualPayment>;
}
