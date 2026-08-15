import { ContractRegisterService } from './contract-register.service';
import { ContractRegister } from '../entities/contract-register.entity';
export declare class ContractRegisterController {
    private readonly service;
    constructor(service: ContractRegisterService);
    create(body: Partial<ContractRegister>): Promise<ContractRegister>;
    findAll(): Promise<ContractRegister[]>;
    findActive(): Promise<ContractRegister[]>;
    findOne(id: number): Promise<ContractRegister>;
    update(id: number, body: Partial<ContractRegister>): Promise<ContractRegister>;
    markExpired(): Promise<void>;
}
