import { Controller, Get, Post, Param, Body, Query, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OpexBudgetService } from './opex.service';
import { Role } from '../entities/user.entity';

@Controller('opex-utilizations')
@UseGuards(AuthGuard('jwt'))
export class OpexUtilizationController {
  constructor(private readonly budgetService: OpexBudgetService) {}

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.budgetService.createUtilizationRequest(body, req.user);
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('branchId') branchId?: string,
    @Query('depId') depId?: string,
    @Query('fiscalYear') fiscalYear?: string,
  ) {
    return this.budgetService.getUtilizations({
      status,
      branchId: branchId ? parseInt(branchId, 10) : undefined,
      depId: depId ? parseInt(depId, 10) : undefined,
      fiscalYear,
    });
  }

  @Post(':id/resolve')
  async resolve(
    @Param('id') id: number,
    @Body() body: { status: 'APPROVED' | 'REJECTED' | 'RETURNED'; remark: string },
    @Request() req: any,
  ) {
    const user = req.user;
    if (user.role !== Role.BRANCH_MANAGER && user.role !== Role.BCC_TEAM && user.role !== Role.ADMIN) {
      throw new HttpException('No permission to resolve utilization requests', HttpStatus.FORBIDDEN);
    }
    return this.budgetService.resolveUtilizationRequest(id, body.status, body.remark, user);
  }
}
