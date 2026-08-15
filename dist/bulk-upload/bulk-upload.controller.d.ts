import { BulkUploadService } from './bulk-upload.service';
export declare class BulkUploadController {
    private readonly service;
    constructor(service: BulkUploadService);
    uploadDistrictPivoted(file: Express.Multer.File, uploadedBy: number, districtName: string, fiscalYear: string): Promise<{
        inserted: number;
        updated: number;
        errors: string[];
    }>;
    upload(type: string, file: Express.Multer.File, uploadedBy: number, budgetCycleId: number): Promise<{
        inserted: number;
        updated: number;
        errors: string[];
    }>;
}
