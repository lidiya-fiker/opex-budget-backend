import { Controller, Get, Post, Param, Body, Query, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OpexBudgetService } from './opex.service';
import { Role } from '../entities/user.entity';

@Controller('opex-transfers')
@UseGuards(AuthGuard('jwt'))
export class OpexTransferController {
  constructor(private readonly budgetService: OpexBudgetService) {}

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.budgetService.createTransferRequest(body, req.user);
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('fiscalYear') fiscalYear?: string,
  ) {
    return this.budgetService.getTransfers({ status, fiscalYear });
  }

  @Post(':id/resolve')
  async resolve(
    @Param('id') id: number,
    @Body() body: { status: 'APPROVED' | 'REJECTED' | 'RETURNED'; remark: string },
    @Request() req: any,
  ) {
    const user = req.user;
    // Check permission: BCC Team or Admin can resolve transfers
    if (user.role !== Role.BCC_TEAM && user.role !== Role.ADMIN) {
      throw new HttpException('No permission to resolve transfers', HttpStatus.FORBIDDEN);
    }
    return this.budgetService.resolveTransferRequest(id, body.status, body.remark, user);
  }
}
