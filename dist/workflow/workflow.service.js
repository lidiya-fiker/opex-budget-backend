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
exports.WorkflowService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const budget_submission_entity_1 = require("../entities/budget-submission.entity");
const budget_item_entity_1 = require("../entities/budget-item.entity");
const workflow_audit_entity_1 = require("../entities/workflow-audit.entity");
const user_entity_1 = require("../entities/user.entity");
const notification_entity_1 = require("../entities/notification.entity");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
const STATUS_NOTIFICATION_MAP = {
    [budget_submission_entity_1.SubmissionStatus.SUBMITTED_TO_BRANCH_MANAGER]: {
        roles: [user_entity_1.Role.BRANCH_MANAGER],
        message: (fy, branch) => `📋 New budget submission from branch "${branch}" for ${fy} is awaiting your review.`,
        link: '/inbox',
    },
    [budget_submission_entity_1.SubmissionStatus.BRANCH_APPROVED]: {
        roles: [user_entity_1.Role.DISTRICT_MANAGER],
        message: (fy, branch) => `✅ Branch "${branch}" budget for ${fy} has been approved and is awaiting district review.`,
        link: '/inbox',
    },
    [budget_submission_entity_1.SubmissionStatus.DISTRICT_REVIEWED]: {
        roles: [user_entity_1.Role.DISTRICT_MANAGER],
        message: (fy, branch) => `📋 Branch "${branch}" budget for ${fy} has been reviewed and is ready for district approval.`,
        link: '/district',
    },
    [budget_submission_entity_1.SubmissionStatus.DISTRICT_APPROVED]: {
        roles: [user_entity_1.Role.BCC_TEAM],
        message: (fy, branch) => `✅ District has approved the budget for "${branch}" (${fy}). Awaiting BCC review.`,
        link: '/inbox',
    },
    [budget_submission_entity_1.SubmissionStatus.BCC_APPROVED]: {
        roles: [user_entity_1.Role.STRATEGY_OFFICER],
        message: (fy, branch) => `✅ BCC has approved the consolidated budget for ${fy} from district of "${branch}". Ready for Strategy review.`,
        link: '/inbox',
    },
    [budget_submission_entity_1.SubmissionStatus.STRATEGY_APPROVED]: {
        roles: [user_entity_1.Role.EXECUTIVE],
        message: (fy, branch) => `✅ Strategy Office has approved the budget for ${fy} (from "${branch}"). Awaiting Executive review.`,
        link: '/inbox',
    },
    [budget_submission_entity_1.SubmissionStatus.EXECUTIVE_APPROVED]: {
        roles: [user_entity_1.Role.BOARD],
        message: (fy, branch) => `✅ Executive has approved the budget for ${fy} (from "${branch}"). Awaiting Board approval.`,
        link: '/inbox',
    },
    [budget_submission_entity_1.SubmissionStatus.BOARD_APPROVED]: {
        roles: [user_entity_1.Role.BRANCH_USER, user_entity_1.Role.BRANCH_MANAGER, user_entity_1.Role.DISTRICT_MANAGER],
        message: (fy, branch) => `🎉 The Board of Directors has officially approved the budget for ${fy}! Branch "${branch}" can now view your final approved budget allocation.`,
        link: '/branch',
    },
    [budget_submission_entity_1.SubmissionStatus.RETURNED]: {
        roles: [user_entity_1.Role.BRANCH_USER, user_entity_1.Role.BRANCH_MANAGER],
        message: (fy, branch) => `↩️ The budget for branch "${branch}" (${fy}) has been returned for revision. Please review the comments.`,
        link: '/branch',
    },
    [budget_submission_entity_1.SubmissionStatus.RETURNED_TO_DISTRICT]: {
        roles: [user_entity_1.Role.DISTRICT_MANAGER],
        message: (fy, branch) => `↩️ The BCC Team has returned the budget for "${branch}" (${fy}) back to your district. Please review the BCC's note and take action.`,
        link: '/district',
    },
};
let WorkflowService = class WorkflowService {
    submissionRepository;
    budgetItemRepository;
    auditRepository;
    userRepository;
    notificationRepository;
    opexBudgetRepository;
    constructor(submissionRepository, budgetItemRepository, auditRepository, userRepository, notificationRepository, opexBudgetRepository) {
        this.submissionRepository = submissionRepository;
        this.budgetItemRepository = budgetItemRepository;
        this.auditRepository = auditRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.opexBudgetRepository = opexBudgetRepository;
    }
    async advanceStatus(submissionId, user, nextStatus, comments) {
        const submission = await this.submissionRepository.findOne({
            where: { id: submissionId },
            relations: ['branch', 'branch.district', 'branch.department', 'budgetCycle', 'items', 'items.category'],
        });
        if (!submission) {
            throw new common_1.BadRequestException('Submission not found');
        }
        const audit = this.auditRepository.create({
            submission: submission,
            actionBy: user,
            fromStatus: submission.status,
            toStatus: nextStatus,
            comments: comments,
        });
        submission.status = nextStatus;
        if (nextStatus === budget_submission_entity_1.SubmissionStatus.BOARD_APPROVED && submission.items) {
            for (const item of submission.items) {
                if (item.approvedAmount === null || item.approvedAmount === undefined) {
                    item.approvedAmount = item.requestedAmount;
                    item.approvedQ1 = item.requestedQ1;
                    item.approvedQ2 = item.requestedQ2;
                    item.approvedQ3 = item.requestedQ3;
                    item.approvedQ4 = item.requestedQ4;
                    await this.budgetItemRepository.save(item);
                }
                if (item.category) {
                    let opexEntry = await this.opexBudgetRepository.findOne({
                        where: {
                            fiscalYear: submission.budgetCycle?.fiscalYear,
                            branch: { id: submission.branch?.id },
                            expenseCategory: item.category.name
                        }
                    });
                    if (!opexEntry) {
                        opexEntry = this.opexBudgetRepository.create({
                            fiscalYear: submission.budgetCycle?.fiscalYear || 'Unknown',
                            level: 'BRANCH',
                            glNumber: item.category.code || 'BUDGET',
                            glDescription: item.category.name,
                            expenseCategory: item.category.name,
                            branch: submission.branch,
                            district: submission.branch?.district,
                            createdBy: user,
                        });
                    }
                    opexEntry.annualAmount = Number(item.approvedAmount);
                    opexEntry.status = 'APPROVED';
                    opexEntry.remark = 'Automatically posted from Board Approved CAPEX submission';
                    const q1m = Number(item.approvedQ1) / 3;
                    const q2m = Number(item.approvedQ2) / 3;
                    const q3m = Number(item.approvedQ3) / 3;
                    const q4m = Number(item.approvedQ4) / 3;
                    opexEntry.m1 = q1m;
                    opexEntry.m2 = q1m;
                    opexEntry.m3 = q1m;
                    opexEntry.m4 = q2m;
                    opexEntry.m5 = q2m;
                    opexEntry.m6 = q2m;
                    opexEntry.m7 = q3m;
                    opexEntry.m8 = q3m;
                    opexEntry.m9 = q3m;
                    opexEntry.m10 = q4m;
                    opexEntry.m11 = q4m;
                    opexEntry.m12 = q4m;
                    await this.opexBudgetRepository.save(opexEntry);
                }
            }
        }
        await this.auditRepository.save(audit);
        const saved = await this.submissionRepository.save(submission);
        await this.sendWorkflowNotifications(submission, nextStatus);
        return saved;
    }
    async sendWorkflowNotifications(submission, nextStatus) {
        const config = STATUS_NOTIFICATION_MAP[nextStatus];
        if (!config)
            return;
        const fiscalYear = submission.budgetCycle?.fiscalYear || 'N/A';
        const branchName = submission.branch?.name || 'Unknown Branch';
        const districtId = submission.branch?.district?.id;
        for (const role of config.roles) {
            let usersToNotify = [];
            if (role === user_entity_1.Role.BRANCH_USER || role === user_entity_1.Role.BRANCH_MANAGER) {
                if (submission.branch?.id) {
                    usersToNotify = await this.userRepository.find({
                        where: { branch: { id: submission.branch.id }, role },
                    });
                }
            }
            else if (role === user_entity_1.Role.DISTRICT_MANAGER) {
                if (districtId) {
                    usersToNotify = await this.userRepository.find({
                        where: { district: { id: districtId }, role },
                    });
                }
            }
            else {
                usersToNotify = await this.userRepository.find({ where: { role } });
            }
            const message = config.message(fiscalYear, branchName);
            let actionLink = config.link;
            const cycleId = submission.budgetCycle?.id;
            if (cycleId) {
                if (role === user_entity_1.Role.BRANCH_USER || role === user_entity_1.Role.BRANCH_MANAGER) {
                    actionLink = `/budget/${cycleId}`;
                }
                else if (role === user_entity_1.Role.DISTRICT_MANAGER) {
                    actionLink = `/budget/${cycleId}?submissionId=${submission.id}`;
                }
            }
            for (const recipient of usersToNotify) {
                const notification = this.notificationRepository.create({
                    user: recipient,
                    message,
                    isRead: false,
                    actionLink: actionLink,
                });
                await this.notificationRepository.save(notification);
            }
        }
    }
};
exports.WorkflowService = WorkflowService;
exports.WorkflowService = WorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(budget_submission_entity_1.BudgetSubmission)),
    __param(1, (0, typeorm_1.InjectRepository)(budget_item_entity_1.BudgetItem)),
    __param(2, (0, typeorm_1.InjectRepository)(workflow_audit_entity_1.WorkflowAudit)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(5, (0, typeorm_1.InjectRepository)(opex_budget_entity_1.OpexBudget)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map