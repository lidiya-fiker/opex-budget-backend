import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BulkUploadService, UploadType } from './bulk-upload.service';

@Controller('bulk-uploads')
export class BulkUploadController {
  constructor(private readonly service: BulkUploadService) {}

  /**
   * POST /bulk-uploads/district-pivoted
   * Specialized endpoint for handling the massive pivoted Excel/CSV format
   * containing District + Branch budgets and actuals.
   */
  @Post('district-pivoted')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDistrictPivoted(
    @UploadedFile() file: Express.Multer.File,
    @Body('uploadedBy') uploadedBy: number,
    @Body('districtName') districtName: string,
    @Body('fiscalYear') fiscalYear: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!districtName) throw new BadRequestException('districtName is required');
    if (!fiscalYear) throw new BadRequestException('fiscalYear is required');

    return this.service.processDistrictPivotedUpload(
      file.buffer,
      Number(uploadedBy),
      districtName,
      fiscalYear,
    );
  }

  /**
   * POST /bulk-uploads/:type
   * :type = conventional | ifb | supplementary
   * Multipart form: file (xlsx or csv), uploadedBy (userId), budgetCycleId (optional)
   */
  @Post(':type')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('uploadedBy') uploadedBy: number,
    @Body('budgetCycleId') budgetCycleId: number,
  ) {
    const validTypes: UploadType[] = ['conventional', 'ifb', 'supplementary'];
    if (!validTypes.includes(type as UploadType)) {
      throw new BadRequestException(`Invalid upload type. Use: ${validTypes.join(', ')}`);
    }
    if (!file) throw new BadRequestException('No file uploaded');

    return this.service.processUpload(
      file.buffer,
      type as UploadType,
      Number(uploadedBy),
      budgetCycleId ? Number(budgetCycleId) : undefined,
    );
  }


}
