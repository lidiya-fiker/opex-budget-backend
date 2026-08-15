import { CbsAdapterService, CbsTransactionInput } from './cbs-adapter.service';
export declare class CbsAdapterController {
    private readonly cbsAdapterService;
    constructor(cbsAdapterService: CbsAdapterService);
    ingestTransactions(body: CbsTransactionInput | CbsTransactionInput[]): Promise<{
        processed: number;
        mapped: number;
        unmapped: number;
        duplicates: number;
    }>;
    uploadTemplate(file: Express.Multer.File): Promise<{
        processed: number;
        mapped: number;
        unmapped: number;
        duplicates: number;
        errors: string[];
    }>;
    getUnmapped(): Promise<import("../entities/core-banking.entity").CoreBankingTransaction[]>;
    manualMap(transactionId: number, allocationId?: number, opexBudgetId?: number): Promise<import("../entities/core-banking.entity").CoreBankingTransaction>;
}
