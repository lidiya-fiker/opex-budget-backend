import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GlAccount, BankingType } from '../entities/gl-account.entity';
export declare const CONVENTIONAL_GL_DATA: {
    glCode: string;
    glDescription: string;
    categoryGroup: string;
}[];
export declare const IFB_GL_DATA: {
    glCode: string;
    glDescription: string;
    categoryGroup: string;
}[];
export declare class GlAccountService implements OnModuleInit {
    private readonly glRepo;
    private readonly logger;
    constructor(glRepo: Repository<GlAccount>);
    onModuleInit(): Promise<void>;
    seedDefaultGls(): Promise<void>;
    findAll(bankingType?: BankingType, search?: string): Promise<GlAccount[]>;
    findByCode(glCode: string): Promise<GlAccount | null>;
    create(data: {
        glCode: string;
        glDescription: string;
        bankingType: BankingType;
        categoryGroup?: string;
    }): Promise<GlAccount>;
    processGlImport(buffer: Buffer, bankingType: BankingType): Promise<{
        inserted: number;
        updated: number;
        errors: string[];
    }>;
}
