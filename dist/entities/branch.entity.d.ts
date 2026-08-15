import { Department } from './department.entity';
import { BudgetSubmission } from './budget-submission.entity';
import { District } from './district.entity';
export declare class Branch {
    id: number;
    code: string;
    name: string;
    area: string | null;
    region: string | null;
    zone: string | null;
    city: string | null;
    phoneNumber: string | null;
    bankingType: 'CONVENTIONAL' | 'IFB' | 'HYBRID';
    isClosed: boolean;
    district: District;
    department: Department | null;
    submissions: BudgetSubmission[];
}
