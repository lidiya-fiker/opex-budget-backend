import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { BudgetCycle } from '../entities/budget-cycle.entity';
import { Branch } from '../entities/branch.entity';
import { ExpenseCategory } from '../entities/expense-category.entity';
import { BudgetSubmission, SubmissionStatus } from '../entities/budget-submission.entity';
import { BudgetItem } from '../entities/budget-item.entity';
import { User, Role } from '../entities/user.entity';
import { Notification } from '../entities/notification.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('budget-cycles')
@UseGuards(AuthGuard('jwt'))
export class BudgetCycleController {
  constructor(
    @InjectRepository(BudgetCycle)
    private readonly cycleRepo: Repository<BudgetCycle>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(ExpenseCategory)
    private readonly categoryRepo: Repository<ExpenseCategory>,
    @InjectRepository(BudgetSubmission)
    private readonly submissionRepo: Repository<BudgetSubmission>,
    @InjectRepository(BudgetItem)
    private readonly itemRepo: Repository<BudgetItem>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  @Get()
  async findAll() {
    return this.cycleRepo.find({ order: { id: 'DESC' } });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.cycleRepo.findOne({ where: { id } });
  }

  @Post()
  async create(@Body() cycleData: Partial<BudgetCycle>) {
    const cycle = this.cycleRepo.create(cycleData);
    return this.cycleRepo.save(cycle);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: Partial<BudgetCycle>) {
    if (data.isActive === true) {
      const activeCycles = await this.cycleRepo.find({ where: { isActive: true } });
      for (const c of activeCycles) {
        if (c.id !== Number(id)) {
          c.isActive = false;
          await this.cycleRepo.save(c);
        }
      }
    }
    await this.cycleRepo.update(id, data);
    return this.cycleRepo.findOne({ where: { id } });
  }

  @Post(':id/publish')
  async publish(@Param('id') id: number) {
    const cycle = await this.cycleRepo.findOne({ where: { id } });
    if (!cycle) {
      throw new Error('Budget cycle not found');
    }

    // Deactivate all other budget cycles
    const activeCycles = await this.cycleRepo.find({ where: { isActive: true } });
    for (const c of activeCycles) {
      if (c.id !== Number(id)) {
        c.isActive = false;
        await this.cycleRepo.save(c);
      }
    }

    cycle.isPublished = true;
    cycle.isActive = true;
    await this.cycleRepo.save(cycle);

    // Find previous budget cycle if it exists (latest cycle before this one)
    const prevCycle = await this.cycleRepo.findOne({
      where: { id: LessThan(id) },
      order: { id: 'DESC' },
    });

    // Generate templates for ALL branches
    const branches = await this.branchRepo.find();
    const categories = await this.categoryRepo.find();

    for (const branch of branches) {
      // Avoid duplicate templates
      let submission = await this.submissionRepo.findOne({
        where: { budgetCycle: { id: cycle.id }, branch: { id: branch.id } },
      });

      if (!submission) {
        submission = this.submissionRepo.create({
          budgetCycle: cycle,
          branch: branch,
          status: SubmissionStatus.DRAFT,
          totalAmount: 0,
        });
        submission = await this.submissionRepo.save(submission);
      }

      // Check if there was a previous cycle submission for this branch
      let prevSubmission: BudgetSubmission | null = null;
      if (prevCycle) {
        prevSubmission = await this.submissionRepo.findOne({
          where: { budgetCycle: { id: prevCycle.id }, branch: { id: branch.id } },
          relations: ['items', 'items.category'],
        });
      }

      // Create items for each category
      for (const category of categories) {
        let item = await this.itemRepo.findOne({
          where: { submission: { id: submission.id }, category: { id: category.id } },
        });

        // Compute historical amount based on previous year's budget
        let historicalAmount = 0;
        if (prevSubmission) {
          const prevItem = prevSubmission.items.find(i => i.category?.id === category.id);
          if (prevItem) {
            historicalAmount = prevItem.approvedAmount !== null ? Number(prevItem.approvedAmount) : Number(prevItem.requestedAmount);
          }
        }

        if (!item) {
          item = this.itemRepo.create({
            submission: submission,
            category: category,
            historicalAmount: historicalAmount,
            requestedAmount: 0,
            currency: 'ETB',
          });
          await this.itemRepo.save(item);
        } else {
          item.historicalAmount = historicalAmount;
          await this.itemRepo.save(item);
        }
      }
    }

    // Send notifications to all BRANCH_USER and BRANCH_MANAGER users
    const notifyRoles = [Role.BRANCH_USER, Role.BRANCH_MANAGER];
    for (const role of notifyRoles) {
      const users = await this.userRepo.find({ where: { role } });
      for (const user of users) {
        const notification = this.notificationRepo.create({
          user,
          message: `📢 A new budget cycle "${cycle.fiscalYear}" has been initiated! Submission deadline: ${cycle.submissionDeadline}. Please prepare and submit your branch budget.`,
          isRead: false,
          actionLink: '/branch',
        });
        await this.notificationRepo.save(notification);
      }
    }

    return { success: true, message: 'Templates successfully published and initialized for all branches.' };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const cycle = await this.cycleRepo.findOne({ where: { id } });
    if (!cycle) {
      throw new HttpException('Budget cycle not found', HttpStatus.NOT_FOUND);
    }

    // Delete all submissions for this cycle first to avoid foreign key constraints
    const submissions = await this.submissionRepo.find({ where: { budgetCycle: { id } } });
    if (submissions.length > 0) {
      await this.submissionRepo.remove(submissions);
    }

    await this.cycleRepo.remove(cycle);
    return { success: true, message: 'Budget cycle deleted successfully' };
  }
}
