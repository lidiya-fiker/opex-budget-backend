import { UnitSubmissionService } from './unit-submission.service';
import { UnitSubmissionStatus } from '../entities/unit-submission-status.entity';
export declare class UnitSubmissionController {
    private readonly service;
    constructor(service: UnitSubmissionService);
    getStatus(cycleId: number): Promise<{
        submitted: UnitSubmissionStatus[];
        notSubmitted: UnitSubmissionStatus[];
        total: number;
    }>;
    sync(units: Partial<UnitSubmissionStatus>[]): Promise<void>;
    markSubmitted(unitId: number, cycleId: number): Promise<UnitSubmissionStatus>;
}
