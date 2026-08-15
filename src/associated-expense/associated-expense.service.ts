import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssociatedExpenseRule } from '../entities/associated-expense-rule.entity';

@Injectable()
export class AssociatedExpenseService {
  constructor(
    @InjectRepository(AssociatedExpenseRule)
    private readonly repo: Repository<AssociatedExpenseRule>,
  ) {}

  async findAll(): Promise<AssociatedExpenseRule[]> {
    return this.repo.find();
  }

  async create(data: Partial<AssociatedExpenseRule>): Promise<AssociatedExpenseRule> {
    return this.repo.save(this.repo.create(data));
  }

  /**
   * Given a main account code and its budget amount, return all
   * auto-calculated associated line items (e.g. pension, trust fund).
   */
  async calculate(
    mainAccountCode: string,
    budgetAmount: number,
  ): Promise<{ linkedAccountCode: string; calculatedAmount: number }[]> {
    const rules = await this.repo.find({ where: { mainAccountCode } });
    return rules.map((r) => ({
      linkedAccountCode: r.linkedAccountCode,
      calculatedAmount: Number((budgetAmount * Number(r.percentage)).toFixed(2)),
    }));
  }
}
