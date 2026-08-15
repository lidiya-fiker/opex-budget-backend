export declare enum BankingType {
    CONVENTIONAL = "CONVENTIONAL",
    IFB = "IFB"
}
export declare class GlAccount {
    id: number;
    glCode: string;
    glDescription: string;
    bankingType: BankingType;
    categoryGroup: string | null;
    isActive: boolean;
    createdAt: Date;
}
