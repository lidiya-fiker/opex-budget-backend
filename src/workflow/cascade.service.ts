import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetSubmission, SubmissionStatus } from '../entities/budget-submission.entity';

@Injectable()
export class CascadeService {
  constructor(
    @InjectRepository(BudgetSubmission)
    private submissionRepository: Repository<BudgetSubmission>,
  ) {}

  /**
   * Distributes the BOARD_APPROVED budget down to branches and updates their allocations.
   * In a real implementation, this would insert records into a `BudgetAllocations` table.
   */
  async cascadeApprovedBudget(cycleId: number): Promise<void> {
    const approvedSubmissions = await this.submissionRepository.find({
      where: { budgetCycle: { id: cycleId }, status: SubmissionStatus.BOARD_APPROVED },
      relations: ['items', 'branch']
    });

    for (const submission of approvedSubmissions) {
      // Simulate cascade: 
      // e.g. Notify branch manager of final allocated amounts
      console.log(`Cascaded budget for Branch ${submission.branch.name}: ${submission.currency} ${submission.totalAmount}`);
    }
  }
}
