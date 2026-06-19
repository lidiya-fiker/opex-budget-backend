import { OpexBudget } from './opex-budget.entity';
import { User } from './user.entity';
export declare class OpexAlert {
    id: number;
    opexBudget: OpexBudget;
    ytdBudget: number;
    ytdActual: number;
    utilizationPct: number;
    status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
    resolutionRemark: string | null;
    resolvedBy: User | null;
    createdAt: Date;
}
