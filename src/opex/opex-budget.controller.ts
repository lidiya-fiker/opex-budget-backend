import { Controller, Get, Post, Patch, Param, Body, Query, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpexBudgetService } from './opex.service';
import { OpexAlert } from '../entities/opex-alert.entity';
import { User, Role } from '../entities/user.entity';
import { OpexBudget } from '../entities/opex-budget.entity';

@Controller('opex-budgets')
@UseGuards(AuthGuard('jwt'))
export class OpexBudgetController {
  constructor(
    private readonly budgetService: OpexBudgetService,
    @InjectRepository(OpexAlert)
    private readonly alertRepo: Repository<OpexAlert>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(OpexBudget)
    private readonly budgetRepo: Repository<OpexBudget>,
  ) {}

  @Post()
  async load(@Body() body: any, @Request() req: any) {
    const user = req.user;
    if (user.role !== Role.BCC_TEAM && user.role !== Role.ADMIN) {
      throw new HttpException('Only BCC staff can load budgets', HttpStatus.FORBIDDEN);
    }
    return this.budgetService.loadBudget(body, user);
  }

  @Get()
  async findAll(
    @Request() req: any,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('level') level?: string,
    @Query('status') status?: string,
    @Query('branchId') branchId?: string,
    @Query('districtId') districtId?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.budgetService.findAll(req.user, {
      fiscalYear,
      level,
      status,
      branchId: branchId ? parseInt(branchId, 10) : undefined,
      districtId: districtId ? parseInt(districtId, 10) : undefined,
      departmentId: departmentId ? parseInt(departmentId, 10) : undefined,
    });
  }

  @Get('alerts')
  async getAlerts(
    @Request() req: any,
    @Query('status') status?: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED',
    @Query('fiscalYear') fiscalYear?: string,
  ) {
    const user = req.user;
    const qb = this.alertRepo.createQueryBuilder('a')
      .leftJoinAndSelect('a.opexBudget', 'b')
      .leftJoinAndSelect('b.branch', 'branch')
      .leftJoinAndSelect('b.department', 'dep')
      .leftJoinAndSelect('a.resolvedBy', 'resolvedBy')
      .orderBy('a.id', 'DESC');

    if (status) qb.andWhere('a.status = :status', { status });
    if (fiscalYear) qb.andWhere('b.fiscalYear = :fiscalYear', { fiscalYear });

    // Enforce Row-Level Security for Alerts
    if (user.role === Role.BRANCH_MANAGER || user.role === Role.BRANCH_USER) {
      qb.andWhere('b.branchId = :userBranchId', { userBranchId: user.branch?.id });
    } else if (user.role === Role.DISTRICT_MANAGER) {
      // Find all branches under this district
      qb.leftJoin('b.branch', 'b_branch');
      qb.andWhere('(b.districtId = :userDistrictId OR b_branch.districtId = :userDistrictId)', { userDistrictId: user.district?.id });
    } else if (user.role === Role.DEPARTMENT_USER) {
      qb.andWhere('b.departmentId = :userDepId', { userDepId: user.department?.id });
    }

    return qb.getMany();
  }

  @Post('alerts/:id/resolve')
  async resolveAlert(
    @Param('id') id: number,
    @Body() body: { status: 'ACKNOWLEDGED' | 'RESOLVED'; remark: string },
    @Request() req: any,
  ) {
    const alert = await this.alertRepo.findOne({
      where: { id },
      relations: ['opexBudget'],
    });
    if (!alert) throw new HttpException('Alert not found', HttpStatus.NOT_FOUND);

    alert.status = body.status;
    alert.resolutionRemark = body.remark;
    alert.resolvedBy = req.user;

    return this.alertRepo.save(alert);
  }

  @Get('fiscal-years')
  async getFiscalYears() {
    const rows = await this.budgetRepo
      .createQueryBuilder('b')
      .select('DISTINCT b.fiscalYear', 'fiscalYear')
      .orderBy('b.fiscalYear', 'ASC')
      .getRawMany();
    return rows.map(r => r.fiscalYear).filter(Boolean);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.budgetService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: any, @Request() req: any) {
    return this.budgetService.updateBudget(id, body, req.user);
  }

  @Post(':id/resolve')
  async resolve(
    @Param('id') id: number,
    @Body() body: { status: 'APPROVED' | 'REJECTED' | 'RETURNED'; remark: string },
    @Request() req: any,
  ) {
    const user = req.user;
    if (user.role !== Role.BCC_TEAM && user.role !== Role.ADMIN) {
      throw new HttpException('Only BCC staff can resolve budget loading requests', HttpStatus.FORBIDDEN);
    }
    return this.budgetService.resolveBudget(id, body.status, body.remark, user);
  }
}
