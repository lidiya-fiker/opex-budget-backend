import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CoreBankingTransaction, CoreBankingLog } from '../entities/core-banking.entity';
import { OpexBudget } from '../entities/opex-budget.entity';
import { OpexAlert } from '../entities/opex-alert.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { OpexBudgetService } from './opex.service';
export declare class CoreBankingService implements OnModuleInit {
    private readonly transactionRepo;
    private readonly logRepo;
    private readonly budgetRepo;
    private readonly alertRepo;
    private readonly notificationRepo;
    private readonly userRepo;
    private readonly budgetService;
    private readonly logger;
    constructor(transactionRepo: Repository<CoreBankingTransaction>, logRepo: Repository<CoreBankingLog>, budgetRepo: Repository<OpexBudget>, alertRepo: Repository<OpexAlert>, notificationRepo: Repository<Notification>, userRepo: Repository<User>, budgetService: OpexBudgetService);
    onModuleInit(): void;
    getFiscalPeriod(date: Date): {
        fiscalYear: string;
        fiscalMonth: number;
    };
    syncTransactions(): Promise<{
        success: boolean;
        count: number;
        unmapped: number;
        error?: string;
    }>;
    checkAndCreateAlert(budget: OpexBudget): Promise<void>;
    sendAlertNotifications(budget: OpexBudget, utilPct: number): Promise<void>;
    private createNotification;
    manualMap(transactionId: number, budgetId: number): Promise<CoreBankingTransaction>;
    generateMockTransactions(count?: number, fiscalYear?: string): Promise<CoreBankingTransaction[]>;
}
