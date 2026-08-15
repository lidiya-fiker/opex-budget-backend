import { Controller, Get, Post, Patch, Query, Param, Body, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { BranchMasterService } from './branch-master.service';

@Controller('branch-master')
@UseGuards(AuthGuard('jwt'))
export class BranchMasterController {
  constructor(private readonly branchMasterService: BranchMasterService) {}

  @Get()
  async getBranches(
    @Query('districtName') districtName?: string,
    @Query('region') region?: string,
    @Query('bankingType') bankingType?: string,
    @Query('search') search?: string,
    @Query('isClosed') isClosed?: string,
  ) {
    return this.branchMasterService.findAll({
      districtName,
      region,
      bankingType,
      search,
      isClosed: isClosed !== undefined ? isClosed === 'true' : undefined,
    });
  }

  @Get(':code')
  async getBranchByCode(@Param('code') code: string) {
    return this.branchMasterService.findByCode(code);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importBranchMaster(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.branchMasterService.processBranchMasterImport(file.buffer);
  }

  @Patch(':code/status')
  async setBranchStatus(@Param('code') code: string, @Body('isClosed') isClosed: boolean) {
    return this.branchMasterService.closeBranch(code, isClosed);
  }
}
