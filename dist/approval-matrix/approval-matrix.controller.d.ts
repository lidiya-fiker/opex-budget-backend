import { ApprovalMatrixService } from './approval-matrix.service';
import { ApprovalMatrix } from '../entities/approval-matrix.entity';
export declare class ApprovalMatrixController {
    private readonly service;
    constructor(service: ApprovalMatrixService);
    findAll(): Promise<ApprovalMatrix[]>;
    getChain(type: string): Promise<string[]>;
    findByType(type: string): Promise<ApprovalMatrix[]>;
    create(body: Partial<ApprovalMatrix>): Promise<ApprovalMatrix>;
    update(id: number, body: Partial<ApprovalMatrix>): Promise<ApprovalMatrix | null>;
    delete(id: number): Promise<void>;
}
