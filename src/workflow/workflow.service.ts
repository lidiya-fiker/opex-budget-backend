import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetSubmission, SubmissionStatus } from '../entities/budget-submission.entity';
import { BudgetItem } from '../entities/budget-item.entity';
import { WorkflowAudit } from '../entities/workflow-audit.entity';
import { User, Role } from '../entities/user.entity';
import { Notification } from '../entities/notification.entity';

// Maps the status being SET to the roles that need to be notified
const STATUS_NOTIFICATION_MAP: Record<string, { roles: Role[]; message: (fiscalYear: string, branchName: string) => string; link: string }> = {
  [SubmissionStatus.SUBMITTED_TO_BRANCH_MANAGER]: {
    roles: [Role.BRANCH_MANAGER],
    message: (fy, branch) => `📋 New budget submission from branch "${branch}" for ${fy} is awaiting your review.`,
    link: '/inbox',
  },
  [SubmissionStatus.BRANCH_APPROVED]: {
    roles: [Role.DISTRICT_MANAGER],
    message: (fy, branch) => `✅ Branch "${branch}" budget for ${fy} has been approved and is awaiting district review.`,
    link: '/inbox',
  },
  [SubmissionStatus.DISTRICT_REVIEWED]: {
    roles: [Role.DISTRICT_MANAGER],
    message: (fy, branch) => `📋 Branch "${branch}" budget for ${fy} has been reviewed and is ready for district approval.`,
    link: '/district',
  },
  [SubmissionStatus.DISTRICT_APPROVED]: {
    roles: [Role.BCC_TEAM],
    message: (fy, branch) => `✅ District has approved the budget for "${branch}" (${fy}). Awaiting BCC review.`,
    link: '/inbox',
  },
  [SubmissionStatus.BCC_APPROVED]: {
    roles: [Role.STRATEGY_OFFICER],
    message: (fy, branch) => `✅ BCC has approved the consolidated budget for ${fy} from district of "${branch}". Ready for Strategy review.`,
    link: '/inbox',
  },
  [SubmissionStatus.STRATEGY_APPROVED]: {
    roles: [Role.EXECUTIVE],
    message: (fy, branch) => `✅ Strategy Office has approved the budget for ${fy} (from "${branch}"). Awaiting Executive review.`,
    link: '/inbox',
  },
  [SubmissionStatus.EXECUTIVE_APPROVED]: {
    roles: [Role.BOARD],
    message: (fy, branch) => `✅ Executive has approved the budget for ${fy} (from "${branch}"). Awaiting Board approval.`,
    link: '/inbox',
  },
  [SubmissionStatus.BOARD_APPROVED]: {
    roles: [Role.BRANCH_USER, Role.BRANCH_MANAGER, Role.DISTRICT_MANAGER],
    message: (fy, branch) => `🎉 The Board of Directors has officially approved the budget for ${fy}! Branch "${branch}" can now view your final approved budget allocation.`,
    link: '/branch',
  },
  [SubmissionStatus.RETURNED]: {
    roles: [Role.BRANCH_USER, Role.BRANCH_MANAGER],
    message: (fy, branch) => `↩️ The budget for branch "${branch}" (${fy}) has been returned for revision. Please review the comments.`,
    link: '/branch',
  },
  [SubmissionStatus.RETURNED_TO_DISTRICT]: {
    roles: [Role.DISTRICT_MANAGER],
    message: (fy, branch) => `↩️ The BCC Team has returned the budget for "${branch}" (${fy}) back to your district. Please review the BCC's note and take action.`,
    link: '/district',
  },
};

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(BudgetSubmission)
    private submissionRepository: Repository<BudgetSubmission>,
    @InjectRepository(BudgetItem)
    private budgetItemRepository: Repository<BudgetItem>,
    @InjectRepository(WorkflowAudit)
    private auditRepository: Repository<WorkflowAudit>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async advanceStatus(submissionId: number, user: User, nextStatus: SubmissionStatus, comments?: string): Promise<BudgetSubmission> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: ['branch', 'branch.district', 'budgetCycle', 'items'],
    });
    if (!submission) {
      throw new BadRequestException('Submission not found');
    }

    const audit = this.auditRepository.create({
      submission: submission,
      actionBy: user,
      fromStatus: submission.status,
      toStatus: nextStatus,
      comments: comments,
    });

    submission.status = nextStatus;

    // When the Board approves, set approvedAmount = requestedAmount for all budget items
    if (nextStatus === SubmissionStatus.BOARD_APPROVED && submission.items) {
      for (const item of submission.items) {
        if (item.approvedAmount === null || item.approvedAmount === undefined) {
          item.approvedAmount = item.requestedAmount;
          item.approvedQ1 = item.requestedQ1;
          item.approvedQ2 = item.requestedQ2;
          item.approvedQ3 = item.requestedQ3;
          item.approvedQ4 = item.requestedQ4;
          await this.budgetItemRepository.save(item);
        }
      }
    }

    await this.auditRepository.save(audit);
    const saved = await this.submissionRepository.save(submission);

    // Send targeted notifications based on the new status
    await this.sendWorkflowNotifications(submission, nextStatus);

    return saved;
  }

  private async sendWorkflowNotifications(submission: BudgetSubmission, nextStatus: SubmissionStatus) {
    const config = STATUS_NOTIFICATION_MAP[nextStatus];
    if (!config) return;

    const fiscalYear = submission.budgetCycle?.fiscalYear || 'N/A';
    const branchName = submission.branch?.name || 'Unknown Branch';
    const districtId = submission.branch?.district?.id;

    // Find users who should receive this notification
    for (const role of config.roles) {
      let usersToNotify: User[] = [];

      if (role === Role.BRANCH_USER || role === Role.BRANCH_MANAGER) {
        // Notify users in the same branch
        if (submission.branch?.id) {
          usersToNotify = await this.userRepository.find({
            where: { branch: { id: submission.branch.id }, role },
          });
        }
      } else if (role === Role.DISTRICT_MANAGER) {
        // Notify the district manager for that branch's district
        if (districtId) {
          usersToNotify = await this.userRepository.find({
            where: { district: { id: districtId }, role },
          });
        }
      } else {
        // For BCC, STRATEGY, EXECUTIVE, BOARD — notify all users with that role
        usersToNotify = await this.userRepository.find({ where: { role } });
      }

      const message = config.message(fiscalYear, branchName);
      
      let actionLink = config.link;
      const cycleId = submission.budgetCycle?.id;
      if (cycleId) {
        if (role === Role.BRANCH_USER || role === Role.BRANCH_MANAGER) {
          actionLink = `/budget/${cycleId}`;
        } else if (role === Role.DISTRICT_MANAGER) {
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
}
