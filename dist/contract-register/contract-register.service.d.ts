import { Repository } from 'typeorm';
import { ContractRegister } from '../entities/contract-register.entity';
import { ManualPaymentService } from '../manual-payment/manual-payment.service';
export declare class ContractRegisterService {
    private readonly repo;
    private readonly manualPaymentService;
    constructor(repo: Repository<ContractRegister>, manualPaymentService: ManualPaymentService);
    create(data: Partial<ContractRegister>): Promise<ContractRegister>;
    findAll(): Promise<ContractRegister[]>;
    findActive(): Promise<ContractRegister[]>;
    findOne(id: number): Promise<ContractRegister>;
    update(id: number, data: Partial<ContractRegister>): Promise<ContractRegister>;
    markExpired(): Promise<void>;
    handleContractAutoProcessing(): Promise<void>;
}
