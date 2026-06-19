import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetSubmission, SubmissionStatus } from '../entities/budget-submission.entity';
import { BudgetItem } from '../entities/budget-item.entity';
import { Branch } from '../entities/branch.entity';
import { BudgetCycle } from '../entities/budget-cycle.entity';
import { ExpenseCategory } from '../entities/expense-category.entity';
import { WorkflowService } from '../workflow/workflow.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('submissions')
@UseGuards(AuthGuard('jwt'))
export class BudgetSubmissionController {
  constructor(
    @InjectRepository(BudgetSubmission)
    private readonly submissionRepo: Repository<BudgetSubmission>,
    @InjectRepository(BudgetItem)
    private readonly itemRepo: Repository<BudgetItem>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(BudgetCycle)
    private readonly cycleRepo: Repository<BudgetCycle>,
    @InjectRepository(ExpenseCategory)
    private readonly categoryRepo: Repository<ExpenseCategory>,
    private readonly workflowService: WorkflowService,
  ) {}

  @Get()
  async findAll(@Request() req) {
    const submissions = await this.submissionRepo.find({
      relations: ['branch', 'branch.district', 'budgetCycle', 'items', 'items.category'],
    });

    const user = req.user;
    if (user.role === 'BRANCH_USER' || user.role === 'BRANCH_MANAGER') {
      return submissions.filter(s => s.branch && s.branch.id === Number(user.branchId));
    } else if (user.role === 'DISTRICT_MANAGER') {
      return submissions.filter(s => s.branch && s.branch.district && s.branch.district.id === Number(user.districtId));
    }

    return submissions;
  }

  @Get('district-branches')
  async getDistrictBranches(@Request() req) {
    if (req.user.role !== 'DISTRICT_MANAGER') {
      throw new BadRequestException('Only District Managers can fetch district branches.');
    }
    return this.branchRepo.find({
      where: { district: { id: req.user.districtId } }
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.submissionRepo.findOne({
      where: { id },
      relations: ['branch', 'budgetCycle', 'items', 'items.category', 'audits', 'audits.actionBy'],
    });
  }

  @Post()
  async create(@Body() data: any, @Request() req) {
    const user = req.user;
    const cycleId = Number(data.budgetCycleId);
    if (!cycleId) {
      throw new BadRequestException('budgetCycleId is required');
    }

    const branchId = Number(user.branchId);
    if (!branchId) {
      throw new BadRequestException('User does not belong to a branch');
    }

    // Find if a submission template already exists
    let submission = await this.submissionRepo.findOne({
      where: { budgetCycle: { id: cycleId }, branch: { id: branchId } },
      relations: ['items', 'items.category', 'branch', 'budgetCycle'],
    });

    if (!submission) {
      const cycle = await this.cycleRepo.findOne({ where: { id: cycleId } });
      const branch = await this.branchRepo.findOne({ where: { id: branchId } });
      if (!cycle || !branch) {
        throw new BadRequestException('Cycle or Branch not found');
      }

      submission = this.submissionRepo.create({
        budgetCycle: cycle,
        branch: branch,
        status: SubmissionStatus.DRAFT,
        totalAmount: 0,
      });
      submission = await this.submissionRepo.save(submission);
    }

    // Update items
    const itemsData = data.items || [];
    let calculatedTotal = 0;

    for (const itemData of itemsData) {
      const categoryId = Number(itemData.categoryId);
      if (!categoryId) continue;

      if (!submission.items) {
        submission.items = [];
      }
      let item = submission.items.find(i => i.category && i.category.id === categoryId);

      const reqQ1 = Number(itemData.requestedQ1) || 0;
      const reqQ2 = Number(itemData.requestedQ2) || 0;
      const reqQ3 = Number(itemData.requestedQ3) || 0;
      const reqQ4 = Number(itemData.requestedQ4) || 0;
      const requestedVal = reqQ1 + reqQ2 + reqQ3 + reqQ4;
      calculatedTotal += requestedVal;

      if (!item) {
        const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
        if (!category) continue;

        item = this.itemRepo.create({
          submission: submission,
          category: category,
          historicalAmount: Number(itemData.historicalAmount) || 0,
          requestedAmount: requestedVal,
          requestedQ1: reqQ1,
          requestedQ2: reqQ2,
          requestedQ3: reqQ3,
          requestedQ4: reqQ4,
          currency: itemData.currency || 'ETB',
          justification: itemData.justification || '',
        });
        submission.items.push(item);
      } else {
        item.requestedAmount = requestedVal;
        item.requestedQ1 = reqQ1;
        item.requestedQ2 = reqQ2;
        item.requestedQ3 = reqQ3;
        item.requestedQ4 = reqQ4;
        item.currency = itemData.currency || 'ETB';
        item.justification = itemData.justification || '';
      }

      await this.itemRepo.save(item);
    }

    // Determine status
    let status = submission.status;
    const isSubmitRequest = data.status === 'SUBMITTED' || data.status === SubmissionStatus.SUBMITTED_TO_BRANCH_MANAGER;
    const isDraftRequest  = data.status === 'DRAFT'     || data.status === SubmissionStatus.DRAFT;

    if (isSubmitRequest) {
      // Guard: only allow submission from DRAFT or RETURNED states
      if (submission.status !== SubmissionStatus.DRAFT && submission.status !== SubmissionStatus.RETURNED) {
        throw new BadRequestException(
          'This budget has already been submitted for the current cycle. You cannot submit it again.'
        );
      }
      status = SubmissionStatus.SUBMITTED_TO_BRANCH_MANAGER;
    } else if (isDraftRequest) {
      // Guard: only allow saving as draft when in DRAFT or RETURNED state
      if (submission.status !== SubmissionStatus.DRAFT && submission.status !== SubmissionStatus.RETURNED) {
        throw new BadRequestException(
          'This budget has already been submitted and cannot be edited.'
        );
      }
      status = SubmissionStatus.DRAFT;
    }

    submission.status = status;
    submission.totalAmount = calculatedTotal;

    return this.submissionRepo.save(submission);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body('status') newStatus: SubmissionStatus,
    @Body('comments') comments: string,
    @Body('items') itemsData: any[],
    @Request() req,
  ) {
if (itemsData && itemsData.length > 0) {
  // Reviewer comments removed; general comment only.
}
    return this.workflowService.advanceStatus(id, req.user, newStatus, comments);
  }

  @Post('exclude')
  async excludeBranch(
    @Body('branchId') branchId: number,
    @Body('cycleId') cycleId: number,
    @Request() req
  ) {
    if (req.user.role !== 'DISTRICT_MANAGER') {
      throw new BadRequestException('Only District Managers can exclude branches.');
    }

    // See if a submission already exists
    let submission = await this.submissionRepo.findOne({
      where: { budgetCycle: { id: cycleId }, branch: { id: branchId } }
    });

    if (submission) {
      return this.workflowService.advanceStatus(submission.id, req.user, SubmissionStatus.EXCLUDED, 'Branch excluded from this cycle by District Manager');
    } else {
      // Create a dummy submission just to mark it excluded
      submission = this.submissionRepo.create({
        branch: { id: branchId },
        budgetCycle: { id: cycleId },
        status: SubmissionStatus.EXCLUDED,
        totalAmount: 0,
        currency: 'ETB',
        exchangeRate: 1
      });
      return this.submissionRepo.save(submission);
    }
  }

  @Post('district-bulk-approve')
  async districtBulkApprove(
    @Body('cycleId') cycleId: number,
    @Request() req
  ) {
    if (req.user.role !== 'DISTRICT_MANAGER') {
      throw new BadRequestException('Only District Managers can bulk approve.');
    }

    // Find all submissions for this district & cycle that are DISTRICT_REVIEWED
    const submissions = await this.submissionRepo.find({
      where: { 
        budgetCycle: { id: cycleId },
        status: SubmissionStatus.DISTRICT_REVIEWED,
        branch: { district: { id: req.user.districtId } }
      },
      relations: ['branch']
    });

    for (const sub of submissions) {
      await this.workflowService.advanceStatus(
        sub.id, 
        req.user, 
        SubmissionStatus.DISTRICT_APPROVED, 
        'Consolidated district bulk approval'
      );
    }

    return { message: `Bulk approved ${submissions.length} branch submissions to BCC.` };
  }

  @Post('bcc-district-bulk-action')
  async bccDistrictBulkAction(
    @Body('districtId') districtId: number,
    @Body('cycleId') cycleId: number,
    @Body('action') action: 'approve' | 'return',
    @Body('comments') comments: string,
    @Request() req
  ) {
    if (req.user.role !== 'BCC_TEAM') {
      throw new BadRequestException('Only BCC Team members can perform this action.');
    }

    const nextStatus = action === 'approve' ? SubmissionStatus.BCC_APPROVED : SubmissionStatus.RETURNED_TO_DISTRICT;

    const submissions = await this.submissionRepo.find({
      where: { 
        budgetCycle: { id: cycleId },
        status: SubmissionStatus.DISTRICT_APPROVED,
        branch: { district: { id: districtId } }
      },
      relations: ['branch']
    });

    for (const sub of submissions) {
      await this.workflowService.advanceStatus(
        sub.id, 
        req.user, 
        nextStatus, 
        comments
      );
    }

    return { message: `Bulk updated ${submissions.length} submissions to ${nextStatus}.` };
  }

  @Patch(':id/district-reapprove')
  async districtReapprove(
    @Param('id') id: number,
    @Body('action') action: 'reapprove' | 'return_to_branch',
    @Body('comments') comments: string,
    @Request() req,
  ) {
    if (req.user.role !== 'DISTRICT_MANAGER') {
      throw new BadRequestException('Only District Managers can perform this action.');
    }

    const submission = await this.submissionRepo.findOne({
      where: { id },
      relations: ['branch'],
    });
    if (!submission) throw new BadRequestException('Submission not found.');
    if (submission.status !== SubmissionStatus.RETURNED_TO_DISTRICT) {
      throw new BadRequestException('This submission is not in RETURNED_TO_DISTRICT status.');
    }

    const nextStatus = action === 'reapprove'
      ? SubmissionStatus.DISTRICT_REVIEWED
      : SubmissionStatus.RETURNED;

    return this.workflowService.advanceStatus(
      id,
      req.user,
      nextStatus,
      comments || (action === 'reapprove' ? 'Re-approved by District Manager after BCC review' : 'Returned to branch by District Manager')
    );
  }

  @Post('exclude-district')
  async excludeDistrict(
    @Body('districtId') districtId: number,
    @Body('cycleId') cycleId: number,
    @Request() req
  ) {
    if (req.user.role !== 'BCC_TEAM') {
      throw new BadRequestException('Only BCC Team members can exclude districts.');
    }

    // Get all branches in the district
    const branches = await this.branchRepo.find({
      where: { district: { id: districtId } }
    });

    for (const branch of branches) {
      // Check if there's an existing submission for this branch + cycle
      let submission = await this.submissionRepo.findOne({
        where: { budgetCycle: { id: cycleId }, branch: { id: branch.id } }
      });

      if (submission) {
        // Advance to EXCLUDED
        await this.workflowService.advanceStatus(
          submission.id,
          req.user,
          SubmissionStatus.EXCLUDED,
          'District excluded by BCC Team'
        );
      } else {
        // Create a placeholder excluded submission
        submission = this.submissionRepo.create({
          branch: { id: branch.id } as any,
          budgetCycle: { id: cycleId } as any,
          status: SubmissionStatus.EXCLUDED,
          totalAmount: 0,
          currency: 'ETB',
          exchangeRate: 1
        });
        await this.submissionRepo.save(submission);
      }
    }

    return { message: `District excluded: ${branches.length} branches marked EXCLUDED.` };
  }

  @Post('bcc-bulk-submit-to-strategy')
  async bccBulkSubmitToStrategy(
    @Body('cycleId') cycleId: number,
    @Body('comments') comments: string,
    @Request() req
  ) {
    if (req.user.role !== 'BCC_TEAM') {
      throw new BadRequestException('Only BCC Team members can submit to Strategy.');
    }

    const submissions = await this.submissionRepo.find({
      where: {
        budgetCycle: { id: cycleId },
        status: SubmissionStatus.DISTRICT_APPROVED,
      },
      relations: ['branch']
    });

    for (const sub of submissions) {
      await this.workflowService.advanceStatus(
        sub.id,
        req.user,
        SubmissionStatus.BCC_APPROVED,
        comments || 'Submitted to Strategy by BCC Team'
      );
    }

    return { message: `Submitted ${submissions.length} branch budgets to Strategy.` };
  }

  @Post('bank-bulk-action')
  async bankBulkAction(
    @Body('cycleId') cycleId: number,
    @Body('action') action: 'approve' | 'return',
    @Body('comments') comments: string,
    @Request() req
  ) {
    const role = req.user.role;
    let fromStatus: SubmissionStatus;
    let toStatus: SubmissionStatus;

    if (role === 'STRATEGY_OFFICER') {
      fromStatus = SubmissionStatus.BCC_APPROVED;
      toStatus = action === 'approve' ? SubmissionStatus.STRATEGY_APPROVED : SubmissionStatus.RETURNED;
    } else if (role === 'EXECUTIVE') {
      fromStatus = SubmissionStatus.STRATEGY_APPROVED;
      toStatus = action === 'approve' ? SubmissionStatus.EXECUTIVE_APPROVED : SubmissionStatus.RETURNED;
    } else if (role === 'BOARD') {
      fromStatus = SubmissionStatus.EXECUTIVE_APPROVED;
      toStatus = action === 'approve' ? SubmissionStatus.BOARD_APPROVED : SubmissionStatus.RETURNED;
    } else {
      throw new BadRequestException('Only Strategy, Executive, or Board can perform bank-level bulk actions.');
    }

    // For Board approval: approve ALL active (non-EXCLUDED) submissions in the cycle
    if (role === 'BOARD' && action === 'approve') {
      const allSubmissions = await this.submissionRepo.find({
        where: {
          budgetCycle: { id: cycleId },
        },
        relations: ['branch'],
      });

      let count = 0;
      for (const sub of allSubmissions) {
        if (sub.status === SubmissionStatus.EXCLUDED || sub.status === SubmissionStatus.BOARD_APPROVED) continue;
        await this.workflowService.advanceStatus(
          sub.id,
          req.user,
          SubmissionStatus.BOARD_APPROVED,
          comments || 'Board approved — final budget allocation'
        );
        count++;
      }

      // Automatically deactivate the budget cycle since it's fully Board approved
      const cycle = await this.cycleRepo.findOne({ where: { id: cycleId } });
      if (cycle) {
        cycle.isActive = false;
        await this.cycleRepo.save(cycle);
      }

      return { message: `Board approved ${count} submissions. All branches have been notified and the budget cycle is closed.` };
    }

    const submissions = await this.submissionRepo.find({
      where: {
        budgetCycle: { id: cycleId },
        status: fromStatus,
      },
      relations: ['branch']
    });

    for (const sub of submissions) {
      await this.workflowService.advanceStatus(
        sub.id,
        req.user,
        toStatus,
        comments || `Bank-level ${action} by ${role}`
      );
    }

    return { message: `Bulk updated ${submissions.length} submissions to ${toStatus}.` };
  }
}
