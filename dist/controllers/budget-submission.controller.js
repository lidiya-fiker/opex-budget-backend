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
exports.BudgetSubmissionController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const budget_submission_entity_1 = require("../entities/budget-submission.entity");
const budget_item_entity_1 = require("../entities/budget-item.entity");
const branch_entity_1 = require("../entities/branch.entity");
const budget_cycle_entity_1 = require("../entities/budget-cycle.entity");
const expense_category_entity_1 = require("../entities/expense-category.entity");
const workflow_service_1 = require("../workflow/workflow.service");
const passport_1 = require("@nestjs/passport");
let BudgetSubmissionController = class BudgetSubmissionController {
    submissionRepo;
    itemRepo;
    branchRepo;
    cycleRepo;
    categoryRepo;
    workflowService;
    constructor(submissionRepo, itemRepo, branchRepo, cycleRepo, categoryRepo, workflowService) {
        this.submissionRepo = submissionRepo;
        this.itemRepo = itemRepo;
        this.branchRepo = branchRepo;
        this.cycleRepo = cycleRepo;
        this.categoryRepo = categoryRepo;
        this.workflowService = workflowService;
    }
    async findAll(req) {
        const submissions = await this.submissionRepo.find({
            relations: ['branch', 'branch.district', 'budgetCycle', 'items', 'items.category'],
        });
        const user = req.user;
        if (user.role === 'BRANCH_USER' || user.role === 'BRANCH_MANAGER') {
            return submissions.filter(s => s.branch && s.branch.id === Number(user.branchId));
        }
        else if (user.role === 'DISTRICT_MANAGER') {
            return submissions.filter(s => s.branch && s.branch.district && s.branch.district.id === Number(user.districtId));
        }
        return submissions;
    }
    async getDistrictBranches(req) {
        if (req.user.role !== 'DISTRICT_MANAGER') {
            throw new common_1.BadRequestException('Only District Managers can fetch district branches.');
        }
        return this.branchRepo.find({
            where: { district: { id: req.user.districtId } }
        });
    }
    async findOne(id) {
        return this.submissionRepo.findOne({
            where: { id },
            relations: ['branch', 'budgetCycle', 'items', 'items.category', 'audits', 'audits.actionBy'],
        });
    }
    async create(data, req) {
        const user = req.user;
        const cycleId = Number(data.budgetCycleId);
        if (!cycleId) {
            throw new common_1.BadRequestException('budgetCycleId is required');
        }
        const branchId = Number(user.branchId);
        if (!branchId) {
            throw new common_1.BadRequestException('User does not belong to a branch');
        }
        let submission = await this.submissionRepo.findOne({
            where: { budgetCycle: { id: cycleId }, branch: { id: branchId } },
            relations: ['items', 'items.category', 'branch', 'budgetCycle'],
        });
        if (!submission) {
            const cycle = await this.cycleRepo.findOne({ where: { id: cycleId } });
            const branch = await this.branchRepo.findOne({ where: { id: branchId } });
            if (!cycle || !branch) {
                throw new common_1.BadRequestException('Cycle or Branch not found');
            }
            submission = this.submissionRepo.create({
                budgetCycle: cycle,
                branch: branch,
                status: budget_submission_entity_1.SubmissionStatus.DRAFT,
                totalAmount: 0,
            });
            submission = await this.submissionRepo.save(submission);
        }
        const itemsData = data.items || [];
        let calculatedTotal = 0;
        for (const itemData of itemsData) {
            const categoryId = Number(itemData.categoryId);
            if (!categoryId)
                continue;
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
                if (!category)
                    continue;
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
            }
            else {
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
        let status = submission.status;
        const isSubmitRequest = data.status === 'SUBMITTED' || data.status === budget_submission_entity_1.SubmissionStatus.SUBMITTED_TO_BRANCH_MANAGER;
        const isDraftRequest = data.status === 'DRAFT' || data.status === budget_submission_entity_1.SubmissionStatus.DRAFT;
        if (isSubmitRequest) {
            if (submission.status !== budget_submission_entity_1.SubmissionStatus.DRAFT && submission.status !== budget_submission_entity_1.SubmissionStatus.RETURNED) {
                throw new common_1.BadRequestException('This budget has already been submitted for the current cycle. You cannot submit it again.');
            }
            status = budget_submission_entity_1.SubmissionStatus.SUBMITTED_TO_BRANCH_MANAGER;
        }
        else if (isDraftRequest) {
            if (submission.status !== budget_submission_entity_1.SubmissionStatus.DRAFT && submission.status !== budget_submission_entity_1.SubmissionStatus.RETURNED) {
                throw new common_1.BadRequestException('This budget has already been submitted and cannot be edited.');
            }
            status = budget_submission_entity_1.SubmissionStatus.DRAFT;
        }
        submission.status = status;
        submission.totalAmount = calculatedTotal;
        return this.submissionRepo.save(submission);
    }
    async updateStatus(id, newStatus, comments, itemsData, req) {
        if (itemsData && itemsData.length > 0) {
        }
        return this.workflowService.advanceStatus(id, req.user, newStatus, comments);
    }
    async excludeBranch(branchId, cycleId, req) {
        if (req.user.role !== 'DISTRICT_MANAGER') {
            throw new common_1.BadRequestException('Only District Managers can exclude branches.');
        }
        let submission = await this.submissionRepo.findOne({
            where: { budgetCycle: { id: cycleId }, branch: { id: branchId } }
        });
        if (submission) {
            return this.workflowService.advanceStatus(submission.id, req.user, budget_submission_entity_1.SubmissionStatus.EXCLUDED, 'Branch excluded from this cycle by District Manager');
        }
        else {
            submission = this.submissionRepo.create({
                branch: { id: branchId },
                budgetCycle: { id: cycleId },
                status: budget_submission_entity_1.SubmissionStatus.EXCLUDED,
                totalAmount: 0,
                currency: 'ETB',
                exchangeRate: 1
            });
            return this.submissionRepo.save(submission);
        }
    }
    async districtBulkApprove(cycleId, req) {
        if (req.user.role !== 'DISTRICT_MANAGER') {
            throw new common_1.BadRequestException('Only District Managers can bulk approve.');
        }
        const submissions = await this.submissionRepo.find({
            where: {
                budgetCycle: { id: cycleId },
                status: budget_submission_entity_1.SubmissionStatus.DISTRICT_REVIEWED,
                branch: { district: { id: req.user.districtId } }
            },
            relations: ['branch']
        });
        for (const sub of submissions) {
            await this.workflowService.advanceStatus(sub.id, req.user, budget_submission_entity_1.SubmissionStatus.DISTRICT_APPROVED, 'Consolidated district bulk approval');
        }
        return { message: `Bulk approved ${submissions.length} branch submissions to BCC.` };
    }
    async bccDistrictBulkAction(districtId, cycleId, action, comments, req) {
        if (req.user.role !== 'BCC_TEAM') {
            throw new common_1.BadRequestException('Only BCC Team members can perform this action.');
        }
        const nextStatus = action === 'approve' ? budget_submission_entity_1.SubmissionStatus.BCC_APPROVED : budget_submission_entity_1.SubmissionStatus.RETURNED_TO_DISTRICT;
        const submissions = await this.submissionRepo.find({
            where: {
                budgetCycle: { id: cycleId },
                status: budget_submission_entity_1.SubmissionStatus.DISTRICT_APPROVED,
                branch: { district: { id: districtId } }
            },
            relations: ['branch']
        });
        for (const sub of submissions) {
            await this.workflowService.advanceStatus(sub.id, req.user, nextStatus, comments);
        }
        return { message: `Bulk updated ${submissions.length} submissions to ${nextStatus}.` };
    }
    async districtReapprove(id, action, comments, req) {
        if (req.user.role !== 'DISTRICT_MANAGER') {
            throw new common_1.BadRequestException('Only District Managers can perform this action.');
        }
        const submission = await this.submissionRepo.findOne({
            where: { id },
            relations: ['branch'],
        });
        if (!submission)
            throw new common_1.BadRequestException('Submission not found.');
        if (submission.status !== budget_submission_entity_1.SubmissionStatus.RETURNED_TO_DISTRICT) {
            throw new common_1.BadRequestException('This submission is not in RETURNED_TO_DISTRICT status.');
        }
        const nextStatus = action === 'reapprove'
            ? budget_submission_entity_1.SubmissionStatus.DISTRICT_REVIEWED
            : budget_submission_entity_1.SubmissionStatus.RETURNED;
        return this.workflowService.advanceStatus(id, req.user, nextStatus, comments || (action === 'reapprove' ? 'Re-approved by District Manager after BCC review' : 'Returned to branch by District Manager'));
    }
    async excludeDistrict(districtId, cycleId, req) {
        if (req.user.role !== 'BCC_TEAM') {
            throw new common_1.BadRequestException('Only BCC Team members can exclude districts.');
        }
        const branches = await this.branchRepo.find({
            where: { district: { id: districtId } }
        });
        for (const branch of branches) {
            let submission = await this.submissionRepo.findOne({
                where: { budgetCycle: { id: cycleId }, branch: { id: branch.id } }
            });
            if (submission) {
                await this.workflowService.advanceStatus(submission.id, req.user, budget_submission_entity_1.SubmissionStatus.EXCLUDED, 'District excluded by BCC Team');
            }
            else {
                submission = this.submissionRepo.create({
                    branch: { id: branch.id },
                    budgetCycle: { id: cycleId },
                    status: budget_submission_entity_1.SubmissionStatus.EXCLUDED,
                    totalAmount: 0,
                    currency: 'ETB',
                    exchangeRate: 1
                });
                await this.submissionRepo.save(submission);
            }
        }
        return { message: `District excluded: ${branches.length} branches marked EXCLUDED.` };
    }
    async bccBulkSubmitToStrategy(cycleId, comments, req) {
        if (req.user.role !== 'BCC_TEAM') {
            throw new common_1.BadRequestException('Only BCC Team members can submit to Strategy.');
        }
        const submissions = await this.submissionRepo.find({
            where: {
                budgetCycle: { id: cycleId },
                status: budget_submission_entity_1.SubmissionStatus.DISTRICT_APPROVED,
            },
            relations: ['branch']
        });
        for (const sub of submissions) {
            await this.workflowService.advanceStatus(sub.id, req.user, budget_submission_entity_1.SubmissionStatus.BCC_APPROVED, comments || 'Submitted to Strategy by BCC Team');
        }
        return { message: `Submitted ${submissions.length} branch budgets to Strategy.` };
    }
    async bankBulkAction(cycleId, action, comments, req) {
        const role = req.user.role;
        let fromStatus;
        let toStatus;
        if (role === 'STRATEGY_OFFICER') {
            fromStatus = budget_submission_entity_1.SubmissionStatus.BCC_APPROVED;
            toStatus = action === 'approve' ? budget_submission_entity_1.SubmissionStatus.STRATEGY_APPROVED : budget_submission_entity_1.SubmissionStatus.RETURNED;
        }
        else if (role === 'EXECUTIVE') {
            fromStatus = budget_submission_entity_1.SubmissionStatus.STRATEGY_APPROVED;
            toStatus = action === 'approve' ? budget_submission_entity_1.SubmissionStatus.EXECUTIVE_APPROVED : budget_submission_entity_1.SubmissionStatus.RETURNED;
        }
        else if (role === 'BOARD') {
            fromStatus = budget_submission_entity_1.SubmissionStatus.EXECUTIVE_APPROVED;
            toStatus = action === 'approve' ? budget_submission_entity_1.SubmissionStatus.BOARD_APPROVED : budget_submission_entity_1.SubmissionStatus.RETURNED;
        }
        else {
            throw new common_1.BadRequestException('Only Strategy, Executive, or Board can perform bank-level bulk actions.');
        }
        if (role === 'BOARD' && action === 'approve') {
            const allSubmissions = await this.submissionRepo.find({
                where: {
                    budgetCycle: { id: cycleId },
                },
                relations: ['branch'],
            });
            let count = 0;
            for (const sub of allSubmissions) {
                if (sub.status === budget_submission_entity_1.SubmissionStatus.EXCLUDED || sub.status === budget_submission_entity_1.SubmissionStatus.BOARD_APPROVED)
                    continue;
                await this.workflowService.advanceStatus(sub.id, req.user, budget_submission_entity_1.SubmissionStatus.BOARD_APPROVED, comments || 'Board approved — final budget allocation');
                count++;
            }
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
            await this.workflowService.advanceStatus(sub.id, req.user, toStatus, comments || `Bank-level ${action} by ${role}`);
        }
        return { message: `Bulk updated ${submissions.length} submissions to ${toStatus}.` };
    }
};
exports.BudgetSubmissionController = BudgetSubmissionController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('district-branches'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "getDistrictBranches", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('comments')),
    __param(3, (0, common_1.Body)('items')),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Array, Object]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('exclude'),
    __param(0, (0, common_1.Body)('branchId')),
    __param(1, (0, common_1.Body)('cycleId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "excludeBranch", null);
__decorate([
    (0, common_1.Post)('district-bulk-approve'),
    __param(0, (0, common_1.Body)('cycleId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "districtBulkApprove", null);
__decorate([
    (0, common_1.Post)('bcc-district-bulk-action'),
    __param(0, (0, common_1.Body)('districtId')),
    __param(1, (0, common_1.Body)('cycleId')),
    __param(2, (0, common_1.Body)('action')),
    __param(3, (0, common_1.Body)('comments')),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "bccDistrictBulkAction", null);
__decorate([
    (0, common_1.Patch)(':id/district-reapprove'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('action')),
    __param(2, (0, common_1.Body)('comments')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "districtReapprove", null);
__decorate([
    (0, common_1.Post)('exclude-district'),
    __param(0, (0, common_1.Body)('districtId')),
    __param(1, (0, common_1.Body)('cycleId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "excludeDistrict", null);
__decorate([
    (0, common_1.Post)('bcc-bulk-submit-to-strategy'),
    __param(0, (0, common_1.Body)('cycleId')),
    __param(1, (0, common_1.Body)('comments')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "bccBulkSubmitToStrategy", null);
__decorate([
    (0, common_1.Post)('bank-bulk-action'),
    __param(0, (0, common_1.Body)('cycleId')),
    __param(1, (0, common_1.Body)('action')),
    __param(2, (0, common_1.Body)('comments')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], BudgetSubmissionController.prototype, "bankBulkAction", null);
exports.BudgetSubmissionController = BudgetSubmissionController = __decorate([
    (0, common_1.Controller)('submissions'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, typeorm_1.InjectRepository)(budget_submission_entity_1.BudgetSubmission)),
    __param(1, (0, typeorm_1.InjectRepository)(budget_item_entity_1.BudgetItem)),
    __param(2, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(3, (0, typeorm_1.InjectRepository)(budget_cycle_entity_1.BudgetCycle)),
    __param(4, (0, typeorm_1.InjectRepository)(expense_category_entity_1.ExpenseCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        workflow_service_1.WorkflowService])
], BudgetSubmissionController);
//# sourceMappingURL=budget-submission.controller.js.map