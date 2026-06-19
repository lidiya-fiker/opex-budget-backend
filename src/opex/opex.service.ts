import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpexBudget } from '../entities/opex-budget.entity';
import { OpexBudgetAudit } from '../entities/opex-budget-audit.entity';
import { OpexTransferRequest } from '../entities/opex-transfer-request.entity';
import { OpexUtilizationRequest } from '../entities/opex-utilization-request.entity';
import { CoreBankingTransaction } from '../entities/core-banking.entity';
import { User } from '../entities/user.entity';
import { Branch } from '../entities/branch.entity';
import { District } from '../entities/district.entity';
import { Department } from '../entities/department.entity';

@Injectable()
export class OpexBudgetService {
  constructor(
    @InjectRepository(OpexBudget)
    private readonly budgetRepo: Repository<OpexBudget>,
    @InjectRepository(OpexBudgetAudit)
    private readonly auditRepo: Repository<OpexBudgetAudit>,
    @InjectRepository(OpexTransferRequest)
    private readonly transferRepo: Repository<OpexTransferRequest>,
    @InjectRepository(OpexUtilizationRequest)
    private readonly utilizationRepo: Repository<OpexUtilizationRequest>,
    @InjectRepository(CoreBankingTransaction)
    private readonly transactionRepo: Repository<CoreBankingTransaction>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  // 1. Budget Loading & Modifications
  async loadBudget(
    data: {
      fiscalYear: string;
      level: 'BANKWIDE' | 'DISTRICT' | 'DEPARTMENT' | 'BRANCH';
      glNumber: string;
      glDescription: string;
      expenseCategory: string;
      annualAmount: number;
      branchId?: number;
      districtId?: number;
      departmentId?: number;
      m1?: number;
      m2?: number;
      m3?: number;
      m4?: number;
      m5?: number;
      m6?: number;
      m7?: number;
      m8?: number;
      m9?: number;
      m10?: number;
      m11?: number;
      m12?: number;
    },
    user: User,
  ): Promise<OpexBudget> {
    const budget = this.budgetRepo.create({
      fiscalYear: data.fiscalYear,
      level: data.level,
      glNumber: data.glNumber,
      glDescription: data.glDescription,
      expenseCategory: data.expenseCategory,
      annualAmount: data.annualAmount,
      status: 'PENDING',
      createdBy: user,
    });

    if (data.branchId) budget.branch = await this.branchRepo.findOneBy({ id: data.branchId });
    if (data.districtId) budget.district = await this.districtRepo.findOneBy({ id: data.districtId });
    if (data.departmentId) budget.department = await this.departmentRepo.findOneBy({ id: data.departmentId });

    // Set allocations (default to equal split if not provided)
    const splitVal = data.annualAmount / 12;
    budget.m1 = data.m1 !== undefined ? data.m1 : splitVal;
    budget.m2 = data.m2 !== undefined ? data.m2 : splitVal;
    budget.m3 = data.m3 !== undefined ? data.m3 : splitVal;
    budget.m4 = data.m4 !== undefined ? data.m4 : splitVal;
    budget.m5 = data.m5 !== undefined ? data.m5 : splitVal;
    budget.m6 = data.m6 !== undefined ? data.m6 : splitVal;
    budget.m7 = data.m7 !== undefined ? data.m7 : splitVal;
    budget.m8 = data.m8 !== undefined ? data.m8 : splitVal;
    budget.m9 = data.m9 !== undefined ? data.m9 : splitVal;
    budget.m10 = data.m10 !== undefined ? data.m10 : splitVal;
    budget.m11 = data.m11 !== undefined ? data.m11 : splitVal;
    budget.m12 = data.m12 !== undefined ? data.m12 : splitVal;

    return this.budgetRepo.save(budget);
  }

  async resolveBudget(id: number, status: 'APPROVED' | 'REJECTED' | 'RETURNED', remark: string, user: User) {
    const budget = await this.budgetRepo.findOneBy({ id });
    if (!budget) throw new HttpException('Budget not found', HttpStatus.NOT_FOUND);

    budget.status = status;
    budget.remark = remark;
    return this.budgetRepo.save(budget);
  }

  async updateBudget(
    id: number,
    data: {
      annualAmount: number;
      m1: number;
      m2: number;
      m3: number;
      m4: number;
      m5: number;
      m6: number;
      m7: number;
      m8: number;
      m9: number;
      m10: number;
      m11: number;
      m12: number;
    },
    user: User,
  ): Promise<OpexBudget> {
    const budget = await this.budgetRepo.findOneBy({ id });
    if (!budget) throw new HttpException('Budget not found', HttpStatus.NOT_FOUND);

    const prevAllocations = {
      m1: budget.m1, m2: budget.m2, m3: budget.m3, m4: budget.m4,
      m5: budget.m5, m6: budget.m6, m7: budget.m7, m8: budget.m8,
      m9: budget.m9, m10: budget.m10, m11: budget.m11, m12: budget.m12,
    };

    const audit = this.auditRepo.create({
      opexBudget: budget,
      previousAmount: budget.annualAmount,
      newAmount: data.annualAmount,
      previousAllocations: JSON.stringify(prevAllocations),
      newAllocations: JSON.stringify(data),
      modificationType: 'MANUAL_EDIT',
      modifiedBy: user,
    });

    budget.annualAmount = data.annualAmount;
    budget.m1 = data.m1; budget.m2 = data.m2; budget.m3 = data.m3; budget.m4 = data.m4;
    budget.m5 = data.m5; budget.m6 = data.m6; budget.m7 = data.m7; budget.m8 = data.m8;
    budget.m9 = data.m9; budget.m10 = data.m10; budget.m11 = data.m11; budget.m12 = data.m12;
    budget.status = 'PENDING'; // Re-verify on edit

    await this.auditRepo.save(audit);
    return this.budgetRepo.save(budget);
  }

  // Helper to compute stats dynamically
  async computeBudgetStats(budget: OpexBudget) {
    // Approved Transfers In
    const transInRes = await this.transferRepo.createQueryBuilder('t')
      .select('SUM(t.amount)', 'sum')
      .where('t.toBudgetId = :id AND t.status = :status', { id: budget.id, status: 'APPROVED' })
      .getRawOne();
    const transferredIn = Number(transInRes?.sum || 0);

    // Approved Transfers Out
    const transOutRes = await this.transferRepo.createQueryBuilder('t')
      .select('SUM(t.amount)', 'sum')
      .where('t.fromBudgetId = :id AND t.status = :status', { id: budget.id, status: 'APPROVED' })
      .getRawOne();
    const transferredOut = Number(transOutRes?.sum || 0);

    // Current Budget = Original Annual + Transfers In - Transfers Out
    const currentBudget = Number(budget.annualAmount) + transferredIn - transferredOut;

    // Committed = Approved Utilizations
    const utilRes = await this.utilizationRepo.createQueryBuilder('u')
      .select('SUM(u.amount)', 'sum')
      .where('u.opexBudgetId = :id AND u.status = :status', { id: budget.id, status: 'APPROVED' })
      .getRawOne();
    const committed = Number(utilRes?.sum || 0);

    // Pending Utilizations
    const pendingUtilRes = await this.utilizationRepo.createQueryBuilder('u')
      .select('SUM(u.amount)', 'sum')
      .where('u.opexBudgetId = :id AND u.status = :status', { id: budget.id, status: 'PENDING' })
      .getRawOne();
    const pendingCommitted = Number(pendingUtilRes?.sum || 0);

    // Actuals = Mapped Core Banking transactions
    const actRes = await this.transactionRepo.createQueryBuilder('tr')
      .select('SUM(tr.amount)', 'sum')
      .where('tr.mappedBudgetId = :id', { id: budget.id })
      .getRawOne();
    const actuals = Number(actRes?.sum || 0);

    const remaining = currentBudget - actuals;
    const remainingForUtil = currentBudget - committed;

    return {
      transferredIn,
      transferredOut,
      currentBudget,
      committed,
      pendingCommitted,
      actuals,
      remaining,
      remainingForUtil,
    };
  }

  // List all loaded budgets with calculated fields
  async findAll(filters: {
    fiscalYear?: string;
    level?: string;
    status?: string;
    branchId?: number;
    districtId?: number;
    departmentId?: number;
  }) {
    const qb = this.budgetRepo.createQueryBuilder('b')
      .leftJoinAndSelect('b.branch', 'branch')
      .leftJoinAndSelect('branch.district', 'branchDistrict')
      .leftJoinAndSelect('b.district', 'district')
      .leftJoinAndSelect('b.department', 'department')
      .leftJoinAndSelect('b.createdBy', 'createdBy');

    if (filters.fiscalYear) qb.andWhere('b.fiscalYear = :fy', { fy: filters.fiscalYear });
    if (filters.level) qb.andWhere('b.level = :level', { level: filters.level });
    if (filters.status) qb.andWhere('b.status = :status', { status: filters.status });
    if (filters.branchId) qb.andWhere('b.branchId = :branchId', { branchId: filters.branchId });
    if (filters.districtId) qb.andWhere('b.districtId = :districtId', { districtId: filters.districtId });
    if (filters.departmentId) qb.andWhere('b.departmentId = :depId', { depId: filters.departmentId });

    const budgets = await qb.getMany();
    const result: any[] = [];

    for (const b of budgets) {
      const stats = await this.computeBudgetStats(b);
      result.push({
        ...b,
        ...stats,
      });
    }

    return result;
  }

  async findOne(id: number) {
    const budget = await this.budgetRepo.findOne({
      where: { id },
      relations: ['branch', 'district', 'department', 'createdBy'],
    });
    if (!budget) throw new HttpException('Budget not found', HttpStatus.NOT_FOUND);

    const stats = await this.computeBudgetStats(budget);
    return {
      ...budget,
      ...stats,
    };
  }

  // 2. Transfers
  async createTransferRequest(
    data: {
      fiscalYear: string;
      requestType: 'TRANSFER' | 'SUPPLEMENTARY';
      fromBudgetId?: number;
      toBudgetId: number;
      amount: number;
      remark: string;
    },
    user: User,
  ) {
    const toBudget = await this.budgetRepo.findOneBy({ id: data.toBudgetId });
    if (!toBudget) throw new HttpException('Destination budget not found', HttpStatus.NOT_FOUND);

    let fromBudget: OpexBudget | null = null;
    if (data.requestType === 'TRANSFER') {
      if (!data.fromBudgetId) throw new HttpException('Source budget is required for transfers', HttpStatus.BAD_REQUEST);
      fromBudget = await this.budgetRepo.findOneBy({ id: data.fromBudgetId });
      if (!fromBudget) throw new HttpException('Source budget not found', HttpStatus.NOT_FOUND);

      const stats = await this.computeBudgetStats(fromBudget);
      if (stats.remainingForUtil < data.amount) {
        throw new HttpException('Insufficient balance in source budget', HttpStatus.BAD_REQUEST);
      }
    }

    const request = this.transferRepo.create({
      fiscalYear: data.fiscalYear,
      requestType: data.requestType,
      fromBudget,
      toBudget,
      amount: data.amount,
      remark: data.remark,
      status: 'PENDING',
      createdBy: user,
    });

    return this.transferRepo.save(request);
  }

  async resolveTransferRequest(id: number, status: 'APPROVED' | 'REJECTED' | 'RETURNED', remark: string, user: User) {
    const request = await this.transferRepo.findOne({
      where: { id },
      relations: ['fromBudget', 'toBudget'],
    });
    if (!request) throw new HttpException('Transfer request not found', HttpStatus.NOT_FOUND);

    if (request.status !== 'PENDING') {
      throw new HttpException('Request already processed', HttpStatus.BAD_REQUEST);
    }

    request.status = status;
    request.resolvedBy = user;
    request.resolvedAt = new Date();
    request.returnRemark = remark;

    if (status === 'APPROVED') {
      // Create audits
      if (request.requestType === 'TRANSFER') {
        const fromStats = await this.computeBudgetStats(request.fromBudget!);
        const auditFrom = this.auditRepo.create({
          opexBudget: request.fromBudget!,
          previousAmount: fromStats.currentBudget,
          newAmount: fromStats.currentBudget - Number(request.amount),
          modificationType: 'TRANSFER_OUT',
          modifiedBy: user,
        });
        await this.auditRepo.save(auditFrom);
      }

      const toStats = await this.computeBudgetStats(request.toBudget);
      const auditTo = this.auditRepo.create({
        opexBudget: request.toBudget,
        previousAmount: toStats.currentBudget,
        newAmount: toStats.currentBudget + Number(request.amount),
        modificationType: request.requestType === 'TRANSFER' ? 'TRANSFER_IN' : 'SUPPLEMENTARY',
        modifiedBy: user,
      });
      await this.auditRepo.save(auditTo);
    }

    return this.transferRepo.save(request);
  }

  async getTransfers(filters: { status?: string; fiscalYear?: string }) {
    const qb = this.transferRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.fromBudget', 'fromBudget')
      .leftJoinAndSelect('fromBudget.branch', 'fromBranch')
      .leftJoinAndSelect('t.toBudget', 'toBudget')
      .leftJoinAndSelect('toBudget.branch', 'toBranch')
      .leftJoinAndSelect('t.createdBy', 'createdBy')
      .leftJoinAndSelect('t.resolvedBy', 'resolvedBy')
      .orderBy('t.id', 'ASC');

    if (filters.status) qb.andWhere('t.status = :status', { status: filters.status });
    if (filters.fiscalYear) qb.andWhere('t.fiscalYear = :fy', { fy: filters.fiscalYear });

    return qb.getMany();
  }

  // 3. Utilizations
  async createUtilizationRequest(
    data: {
      opexBudgetId: number;
      amount: number;
      description: string;
    },
    user: User,
  ) {
    const budget = await this.budgetRepo.findOneBy({ id: data.opexBudgetId });
    if (!budget) throw new HttpException('Budget not found', HttpStatus.NOT_FOUND);

    const stats = await this.computeBudgetStats(budget);
    if (stats.remainingForUtil < data.amount) {
      throw new HttpException('Insufficient remaining budget', HttpStatus.BAD_REQUEST);
    }

    const request = this.utilizationRepo.create({
      opexBudget: budget,
      amount: data.amount,
      description: data.description,
      status: 'PENDING',
      createdBy: user,
    });

    return this.utilizationRepo.save(request);
  }

  async resolveUtilizationRequest(id: number, status: 'APPROVED' | 'REJECTED' | 'RETURNED', remark: string, user: User) {
    const request = await this.utilizationRepo.findOne({
      where: { id },
      relations: ['opexBudget'],
    });
    if (!request) throw new HttpException('Request not found', HttpStatus.NOT_FOUND);

    if (request.status !== 'PENDING') {
      throw new HttpException('Request already resolved', HttpStatus.BAD_REQUEST);
    }

    request.status = status;
    request.resolvedBy = user;
    request.resolvedAt = new Date();
    request.returnRemark = remark;

    return this.utilizationRepo.save(request);
  }

  async getUtilizations(filters: { status?: string; branchId?: number; depId?: number; fiscalYear?: string }) {
    const qb = this.utilizationRepo.createQueryBuilder('u')
      .leftJoinAndSelect('u.opexBudget', 'b')
      .leftJoinAndSelect('b.branch', 'branch')
      .leftJoinAndSelect('b.department', 'dep')
      .leftJoinAndSelect('u.createdBy', 'createdBy')
      .leftJoinAndSelect('u.resolvedBy', 'resolvedBy')
      .orderBy('u.id', 'ASC');

    if (filters.status) qb.andWhere('u.status = :status', { status: filters.status });
    if (filters.branchId) qb.andWhere('b.branchId = :branchId', { branchId: filters.branchId });
    if (filters.depId) qb.andWhere('b.departmentId = :depId', { depId: filters.depId });
    if (filters.fiscalYear) qb.andWhere('b.fiscalYear = :fy', { fy: filters.fiscalYear });

    return qb.getMany();
  }
}
