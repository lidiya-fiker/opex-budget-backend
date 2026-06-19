import { Repository } from 'typeorm';
import { CoreBankingService } from './core-banking.service';
import { CoreBankingTransaction, CoreBankingLog } from '../entities/core-banking.entity';
export declare class CoreBankingController {
    private readonly cbService;
    private readonly transactionRepo;
    private readonly logRepo;
    constructor(cbService: CoreBankingService, transactionRepo: Repository<CoreBankingTransaction>, logRepo: Repository<CoreBankingLog>);
    refresh(req: any): Promise<{
        success: boolean;
        count: number;
        unmapped: number;
        error?: string;
    }>;
    getLogs(): Promise<CoreBankingLog[]>;
    getUnmapped(): Promise<CoreBankingTransaction[]>;
    manualMap(id: number, body: {
        budgetId: number;
    }, req: any): Promise<CoreBankingTransaction>;
    simulate(body: {
        count?: number;
        fiscalYear?: string;
    }, req: any): Promise<CoreBankingTransaction[]>;
}
