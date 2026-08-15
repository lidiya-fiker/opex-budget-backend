import { Controller, Get, Post, Query, Body, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { BranchBudgetAllocationService } from './branch-budget-allocation.service';

@Controller('branch-budget-allocations')
@UseGuards(AuthGuard('jwt'))
export class BranchBudgetAllocationController {
  constructor(private readonly allocService: BranchBudgetAllocationService) {}

  @Get()
  async getAllocations(
    @Query('fiscalYear') fiscalYear?: string,
    @Query('branchCode') branchCode?: string,
    @Query('districtId') districtId?: string,
    @Query('bankingType') bankingType?: 'CONVENTIONAL' | 'IFB',
    @Query('isBaseline') isBaseline?: string,
  ) {
    return this.allocService.findAll({
      fiscalYear,
      branchCode,
      districtId: districtId ? parseInt(districtId, 10) : undefined,
      bankingType,
      isBaseline: isBaseline !== undefined ? isBaseline === 'true' : undefined,
    });
  }

  @Get('bva')
  async getBudgetVsActual(
    @Query('fiscalYear') fiscalYear: string,
    @Query('baselineYear') baselineYear?: string,
    @Query('districtId') districtId?: string,
    @Query('branchId') branchId?: string,
    @Query('bankingType') bankingType?: 'CONVENTIONAL' | 'IFB',
    @Query('glCode') glCode?: string,
  ) {
    if (!fiscalYear) throw new BadRequestException('fiscalYear parameter is required');
    return this.allocService.computeBudgetVsActual({
      fiscalYear,
      baselineYear,
      districtId: districtId ? parseInt(districtId, 10) : undefined,
      branchId: branchId ? parseInt(branchId, 10) : undefined,
      bankingType,
      glCode,
    });
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importAllocations(
    @UploadedFile() file: Express.Multer.File,
    @Body('fiscalYear') fiscalYear: string,
    @Body('isBaseline') isBaseline: string,
    @Body('bankingType') bankingType?: 'CONVENTIONAL' | 'IFB',
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!fiscalYear) throw new BadRequestException('fiscalYear is required');
    return this.allocService.processBudgetAllocationImport(
      file.buffer,
      fiscalYear,
      isBaseline === 'true',
      bankingType || 'CONVENTIONAL',
    );
  }
}
