import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CbsAdapterService, CbsTransactionInput } from './cbs-adapter.service';

@Controller('cbs')
@UseGuards(AuthGuard('jwt'))
export class CbsAdapterController {
  constructor(private readonly cbsAdapterService: CbsAdapterService) {}

  @Post('transactions')
  async ingestTransactions(@Body() body: CbsTransactionInput | CbsTransactionInput[]) {
    const inputs = Array.isArray(body) ? body : [body];
    if (!inputs.length) throw new BadRequestException('Empty transaction payload');
    return this.cbsAdapterService.processIncomingTransactions(inputs);
  }

  @Post('upload-template')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTemplate(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.cbsAdapterService.processTemplateUpload(file.buffer);
  }

  @Get('unmapped')
  async getUnmapped() {
    return this.cbsAdapterService.getUnmappedTransactions();
  }

  @Post('map-manual')
  async manualMap(
    @Body('transactionId') transactionId: number,
    @Body('allocationId') allocationId?: number,
    @Body('opexBudgetId') opexBudgetId?: number,
  ) {
    if (!transactionId) throw new BadRequestException('transactionId is required');
    return this.cbsAdapterService.manualMapTransaction(transactionId, allocationId, opexBudgetId);
  }
}
