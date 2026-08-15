import { Controller, Get, Post, Query, Body, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { GlAccountService } from './gl-account.service';
import { BankingType } from '../entities/gl-account.entity';

@Controller('gl-accounts')
@UseGuards(AuthGuard('jwt'))
export class GlAccountController {
  constructor(private readonly glService: GlAccountService) {}

  @Get()
  async getGlAccounts(@Query('bankingType') bankingType?: BankingType, @Query('search') search?: string) {
    return this.glService.findAll(bankingType, search);
  }

  @Get('conventional')
  async getConventionalGls(@Query('search') search?: string) {
    return this.glService.findAll(BankingType.CONVENTIONAL, search);
  }

  @Get('ifb')
  async getIfbGls(@Query('search') search?: string) {
    return this.glService.findAll(BankingType.IFB, search);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importGls(
    @UploadedFile() file: Express.Multer.File,
    @Body('bankingType') bankingType: BankingType,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!bankingType || (bankingType !== BankingType.CONVENTIONAL && bankingType !== BankingType.IFB)) {
      throw new BadRequestException('Invalid bankingType. Must be CONVENTIONAL or IFB');
    }
    return this.glService.processGlImport(file.buffer, bankingType);
  }

  @Post()
  async createGlAccount(@Body() body: { glCode: string; glDescription: string; bankingType: BankingType; categoryGroup?: string }) {
    return this.glService.create(body);
  }
}
