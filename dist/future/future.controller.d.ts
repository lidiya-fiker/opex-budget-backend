import { RevenueForecastService } from './revenue-forecast.service';
import { ProFormaService } from './pro-forma.service';
export declare class FutureController {
    private readonly revenueService;
    private readonly proFormaService;
    constructor(revenueService: RevenueForecastService, proFormaService: ProFormaService);
    getLoan(fy: string): Promise<{
        module: string;
        fiscalYear: string;
        status: string;
        message: string;
        inputs: string[];
    }>;
    getInvestment(fy: string): Promise<{
        module: string;
        fiscalYear: string;
        status: string;
        message: string;
        inputs: string[];
    }>;
    getFx(fy: string): Promise<{
        module: string;
        fiscalYear: string;
        status: string;
        message: string;
        inputs: string[];
    }>;
    getFees(fy: string): Promise<{
        module: string;
        fiscalYear: string;
        status: string;
        message: string;
        inputs: string[];
    }>;
    getOther(fy: string): Promise<{
        module: string;
        fiscalYear: string;
        status: string;
        message: string;
        inputs: string[];
    }>;
    getIncome(fy: string): Promise<{
        statement: string;
        fiscalYear: string;
        status: string;
        message: string;
        sections: string[];
    }>;
    getBalance(fy: string): Promise<{
        statement: string;
        fiscalYear: string;
        status: string;
        message: string;
        sections: string[];
    }>;
    getCashFlow(fy: string): Promise<{
        statement: string;
        fiscalYear: string;
        status: string;
        message: string;
        sections: string[];
    }>;
    getRatios(fy: string): Promise<{
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
