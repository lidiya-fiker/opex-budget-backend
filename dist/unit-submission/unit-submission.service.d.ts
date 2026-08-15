import { Repository } from 'typeorm';
import { UnitSubmissionStatus } from '../entities/unit-submission-status.entity';
export declare class UnitSubmissionService {
    private readonly repo;
    constructor(repo: Repository<UnitSubmissionStatus>);
    getStatus(budgetCycleId: number): Promise<{
        submitted: UnitSubmissionStatus[];
        notSubmitted: UnitSubmissionStatus[];
        total: number;
    }>;
    markSubmitted(unitId: number, budgetCycleId: number): Promise<UnitSubmissionStatus>;
    syncUnits(units: Partial<UnitSubmissionStatus>[]): Promise<void>;
}
