export declare class ProFormaService {
    getIncomeStatement(fiscalYear: string): Promise<{
        statement: string;
        fiscalYear: string;
        status: string;
        message: string;
        sections: string[];
    }>;
    getBalanceSheet(fiscalYear: string): Promise<{
        statement: string;
        fiscalYear: string;
        status: string;
        message: string;
        sections: string[];
    }>;
    getCashFlowStatement(fiscalYear: string): Promise<{
        statement: string;
        fiscalYear: string;
        status: string;
        message: string;
        sections: string[];
    }>;
    getKeyRatios(fiscalYear: string): Promise<{
        statement: string;
        fiscalYear: string;
        status: string;
        message: string;
        ratios: {
            CIR: string;
            NIM: string;
            CAR: string;
            LDR: string;
        };
    }>;
}
