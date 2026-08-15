import { Repository } from 'typeorm';
import { ManualPayment } from '../entities/manual-payment.entity';
import { CreateManualPaymentDto } from '../dto/create-manual-payment.dto';
import { EmailService } from '../email/email.service';
export declare class ManualPaymentService {
    private readonly manualPaymentRepo;
    private readonly emailService;
    constructor(manualPaymentRepo: Repository<ManualPayment>, emailService: EmailService);
    create(dto: CreateManualPaymentDto, requesterId: number): Promise<ManualPayment>;
    approve(id: number): Promise<ManualPayment>;
    confirm(token: string): Promise<ManualPayment>;
    findAll(): Promise<ManualPayment[]>;
    getBreakdown(): Promise<{
        paymentType: string;
        count: number;
        totalAmount: number;
    }[]>;
}
