import { GlAccountService } from './gl-account.service';
import { BankingType } from '../entities/gl-account.entity';
export declare class GlAccountController {
    private readonly glService;
    constructor(glService: GlAccountService);
    getGlAccounts(bankingType?: BankingType, search?: string): Promise<import("../entities/gl-account.entity").GlAccount[]>;
    getConventionalGls(search?: string): Promise<import("../entities/gl-account.entity").GlAccount[]>;
    getIfbGls(search?: string): Promise<import("../entities/gl-account.entity").GlAccount[]>;
    importGls(file: Express.Multer.File, bankingType: BankingType): Promise<{
        inserted: number;
        updated: number;
        errors: string[];
    }>;
    createGlAccount(body: {
        glCode: string;
        glDescription: string;
        bankingType: BankingType;
        categoryGroup?: string;
    }): Promise<import("../entities/gl-account.entity").GlAccount>;
}
