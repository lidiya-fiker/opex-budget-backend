import { Repository } from 'typeorm';
import { CoreBankingTransaction, CoreBankingLog } from '../entities/core-banking.entity';
import { BranchBudgetAllocation } from '../entities/branch-budget-allocation.entity';
import { OpexBudget } from '../entities/opex-budget.entity';
import { Branch } from '../entities/branch.entity';
import { GlAccount } from '../entities/gl-account.entity';
import { OpexAlert } from '../entities/opex-alert.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
export interface CbsTransactionInput {
    referenceNumber?: string;
    transactionDate: string | Date;
    valueDate?: string | Date;
    costCenterCode: string;
    glCode: string;
    bankingType?: 'CONVENTIONAL' | 'IFB';
    amount: number;
    description: string;
}
export declare class CbsAdapterService {
    private readonly txRepo;
    private readonly logRepo;
    private readonly allocRepo;
    private readonly opexRepo;
    private readonly branchRepo;
    private readonly glRepo;
    private readonly alertRepo;
    private readonly notifRepo;
    private readonly userRepo;
    private readonly logger;
    constructor(txRepo: Repository<CoreBankingTransaction>, logRepo: Repository<CoreBankingLog>, allocRepo: Repository<BranchBudgetAllocation>, opexRepo: Repository<OpexBudget>, branchRepo: Repository<Branch>, glRepo: Repository<GlAccount>, alertRepo: Repository<OpexAlert>, notifRepo: Repository<Notification>, userRepo: Repository<User>);
    processIncomingTransactions(inputs: CbsTransactionInput[]): Promise<{
        processed: number;
        mapped: number;
        unmapped: number;
        duplicates: number;
    }>;
    getUnmappedTransactions(): Promise<CoreBankingTransaction[]>;
    manualMapTransaction(txId: number, allocationId?: number, opexBudgetId?: number): Promise<CoreBankingTransaction>;
    processTemplateUpload(buffer: Buffer): Promise<{
        processed: number;
        mapped: number;
        unmapped: number;
        duplicates: number;
        errors: string[];
    }>;
    private notifyAdmins;
}
