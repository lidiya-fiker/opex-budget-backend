import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractRegister } from '../entities/contract-register.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ManualPaymentService } from '../manual-payment/manual-payment.service';

@Injectable()
export class ContractRegisterService {
  constructor(
    @InjectRepository(ContractRegister)
    private readonly repo: Repository<ContractRegister>,
    private readonly manualPaymentService: ManualPaymentService,
  ) {}

  async create(data: Partial<ContractRegister>): Promise<ContractRegister> {
    const contract = this.repo.create(data);
    return this.repo.save(contract);
  }

  async findAll(): Promise<ContractRegister[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findActive(): Promise<ContractRegister[]> {
    return this.repo.find({ where: { status: 'ACTIVE' }, order: { periodEnd: 'ASC' } });
  }

  async findOne(id: number): Promise<ContractRegister> {
    const contract = await this.repo.findOne({ where: { id } });
    if (!contract) throw new NotFoundException(`Contract #${id} not found`);
    return contract;
  }

  async update(id: number, data: Partial<ContractRegister>): Promise<ContractRegister> {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async markExpired(): Promise<void> {
    // Automatically expire contracts whose period_end < today
    await this.repo
      .createQueryBuilder()
      .update(ContractRegister)
      .set({ status: 'EXPIRED' })
      .where('period_end < :now AND status = :active', { now: new Date(), active: 'ACTIVE' })
      .execute();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleContractAutoProcessing() {
    await this.markExpired();

    // Find active AMC contracts
    const activeContracts = await this.repo.find({ where: { status: 'ACTIVE', contractType: 'AMC' } });
    const now = new Date();

    for (const contract of activeContracts) {
      // Create manual payment 30 days before period_end
      const timeToExpiry = contract.periodEnd.getTime() - now.getTime();
      const daysToExpiry = timeToExpiry / (1000 * 3600 * 24);

      if (daysToExpiry > 0 && daysToExpiry <= 30) {
        // Here we could check if a payment has already been requested.
        // For demonstration, we simply generate the payment request.
        try {
          await this.manualPaymentService.create({
            budgetCode: contract.budgetCode || '55010',
            description: `Auto-generated AMC payment for ${contract.vendorName}`,
            amount: Number(contract.amount) / 12, // Monthly split from contract amount
            paymentType: 'AMC',
            requesterId: 1, // System/Admin user
          }, 1);
        } catch (e) {
          console.error(`Failed to auto-generate payment for contract ${contract.id}:`, e.message);
        }
      }
    }
  }
}
