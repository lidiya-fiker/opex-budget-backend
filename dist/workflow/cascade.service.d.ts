import { Repository } from 'typeorm';
import { BudgetSubmission } from '../entities/budget-submission.entity';
export declare class CascadeService {
    private submissionRepository;
    constructor(submissionRepository: Repository<BudgetSubmission>);
    cascadeApprovedBudget(cycleId: number): Promise<void>;
}
