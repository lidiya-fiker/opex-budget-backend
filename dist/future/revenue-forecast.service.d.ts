export declare class RevenueForecastService {
    getLoanForecast(fiscalYear: string): Promise<{
        module: string;
        fiscalYear: string;
        status: string;
        message: string;
        inputs: string[];
    }>;
    getInvestmentIncomeForecast(fiscalYear: string): Promise<{
        module: string;
        fiscalYear: string;
        status: string;
        message: string;
        inputs: string[];
    }>;
    getFxIncomeForecast(fiscalYear: string): Promise<{
        module: string;
        fiscalYear: string;
        status: string;
        message: string;
        inputs: string[];
    }>;
    getFeeForecast(fiscalYear: string): Promise<{
        module: string;
        fiscalYear: string;
        status: string;
        message: string;
        inputs: string[];
    }>;
    getOtherIncomeForecast(fiscalYear: string): Promise<{
        module: string;
        fiscalYear: string;
        status: string;
        message: string;
        inputs: string[];
    }>;
}
