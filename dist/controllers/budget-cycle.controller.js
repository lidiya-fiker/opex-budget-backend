"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetCycleController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const budget_cycle_entity_1 = require("../entities/budget-cycle.entity");
const branch_entity_1 = require("../entities/branch.entity");
const expense_category_entity_1 = require("../entities/expense-category.entity");
const budget_submission_entity_1 = require("../entities/budget-submission.entity");
const budget_item_entity_1 = require("../entities/budget-item.entity");
const user_entity_1 = require("../entities/user.entity");
const notification_entity_1 = require("../entities/notification.entity");
const passport_1 = require("@nestjs/passport");
let BudgetCycleController = class BudgetCycleController {
    cycleRepo;
    branchRepo;
    categoryRepo;
    submissionRepo;
    itemRepo;
    userRepo;
    notificationRepo;
    constructor(cycleRepo, branchRepo, categoryRepo, submissionRepo, itemRepo, userRepo, notificationRepo) {
        this.cycleRepo = cycleRepo;
        this.branchRepo = branchRepo;
        this.categoryRepo = categoryRepo;
        this.submissionRepo = submissionRepo;
        this.itemRepo = itemRepo;
        this.userRepo = userRepo;
        this.notificationRepo = notificationRepo;
    }
    async findAll() {
        return this.cycleRepo.find({ order: { id: 'DESC' } });
    }
    async findOne(id) {
        return this.cycleRepo.findOne({ where: { id } });
    }
    async create(cycleData) {
        const cycle = this.cycleRepo.create(cycleData);
        return this.cycleRepo.save(cycle);
    }
    async update(id, data) {
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
    async publish(id) {
        const cycle = await this.cycleRepo.findOne({ where: { id } });
        if (!cycle) {
            throw new Error('Budget cycle not found');
        }
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
        const prevCycle = await this.cycleRepo.findOne({
            where: { id: (0, typeorm_2.LessThan)(id) },
            order: { id: 'DESC' },
        });
        const branches = await this.branchRepo.find();
        const categories = await this.categoryRepo.find();
        for (const branch of branches) {
            let submission = await this.submissionRepo.findOne({
                where: { budgetCycle: { id: cycle.id }, branch: { id: branch.id } },
            });
            if (!submission) {
                submission = this.submissionRepo.create({
                    budgetCycle: cycle,
                    branch: branch,
                    status: budget_submission_entity_1.SubmissionStatus.DRAFT,
                    totalAmount: 0,
                });
                submission = await this.submissionRepo.save(submission);
            }
            let prevSubmission = null;
            if (prevCycle) {
                prevSubmission = await this.submissionRepo.findOne({
                    where: { budgetCycle: { id: prevCycle.id }, branch: { id: branch.id } },
                    relations: ['items', 'items.category'],
                });
            }
            for (const category of categories) {
                let item = await this.itemRepo.findOne({
                    where: { submission: { id: submission.id }, category: { id: category.id } },
                });
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
                }
                else {
                    item.historicalAmount = historicalAmount;
                    await this.itemRepo.save(item);
                }
            }
        }
        const notifyRoles = [user_entity_1.Role.BRANCH_USER, user_entity_1.Role.BRANCH_MANAGER];
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
    async remove(id) {
        const cycle = await this.cycleRepo.findOne({ where: { id } });
        if (!cycle) {
            throw new common_1.HttpException('Budget cycle not found', common_1.HttpStatus.NOT_FOUND);
        }
        const submissions = await this.submissionRepo.find({ where: { budgetCycle: { id } } });
        if (submissions.length > 0) {
            await this.submissionRepo.remove(submissions);
        }
        await this.cycleRepo.remove(cycle);
        return { success: true, message: 'Budget cycle deleted successfully' };
    }
};
exports.BudgetCycleController = BudgetCycleController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BudgetCycleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BudgetCycleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BudgetCycleController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BudgetCycleController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BudgetCycleController.prototype, "publish", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BudgetCycleController.prototype, "remove", null);
exports.BudgetCycleController = BudgetCycleController = __decorate([
    (0, common_1.Controller)('budget-cycles'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, typeorm_1.InjectRepository)(budget_cycle_entity_1.BudgetCycle)),
    __param(1, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(2, (0, typeorm_1.InjectRepository)(expense_category_entity_1.ExpenseCategory)),
    __param(3, (0, typeorm_1.InjectRepository)(budget_submission_entity_1.BudgetSubmission)),
    __param(4, (0, typeorm_1.InjectRepository)(budget_item_entity_1.BudgetItem)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(6, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BudgetCycleController);
//# sourceMappingURL=budget-cycle.controller.js.map