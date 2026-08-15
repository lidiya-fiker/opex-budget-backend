import { Repository } from 'typeorm';
import { ApprovalMatrix } from '../entities/approval-matrix.entity';
export declare class ApprovalMatrixService {
    private readonly repo;
    constructor(repo: Repository<ApprovalMatrix>);
    findByType(requestType: string): Promise<ApprovalMatrix[]>;
    findAll(): Promise<ApprovalMatrix[]>;
    create(data: Partial<ApprovalMatrix>): Promise<ApprovalMatrix>;
    update(id: number, data: Partial<ApprovalMatrix>): Promise<ApprovalMatrix | null>;
    delete(id: number): Promise<void>;
    getApprovalChain(requestType: string): Promise<string[]>;
}
