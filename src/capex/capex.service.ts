import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CapexBusinessCase } from '../entities/capex-business-case.entity';

const CAPEX_THRESHOLD = 25_000_000; // ETB 25 Million

const EVALUATION_CRITERIA = [
  'strategic_alignment',
  'regulatory_compliance',
  'financial_returns',
  'banking_ratio_impact',
  'cost_reference_accuracy',
  'revenue_drivers',
  'cost_efficiency_gains',
  'risk_assessment',
  'technology_feasibility',
  'data_security',
  'customer_impact',
  'competitive_advantage',
  'liquidity_impact',
  'implementation_readiness',
  'vendor_capability',
  'kpi_framework',
  'alternative_options',
  'esg_contribution',
];

@Injectable()
export class CapexService {
  constructor(
    @InjectRepository(CapexBusinessCase)
    private readonly repo: Repository<CapexBusinessCase>,
  ) {}

  async create(data: Partial<CapexBusinessCase>): Promise<CapexBusinessCase> {
    if (Number(data.investmentAmount) > CAPEX_THRESHOLD && !data.evaluationJson) {
      // Flag: business case required
      data.status = 'FLAGGED_AWAITING_CASE';
    }
    return this.repo.save(this.repo.create(data));
  }

  async findAll(): Promise<CapexBusinessCase[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<CapexBusinessCase> {
    const bc = await this.repo.findOne({ where: { id } });
    if (!bc) throw new NotFoundException(`CAPEX business case #${id} not found`);
    return bc;
  }

  async score(id: number, evaluation: Record<string, number>): Promise<CapexBusinessCase> {
    const bc = await this.findOne(id);
    bc.evaluationJson = evaluation;
    const values = Object.values(evaluation);
    bc.totalScore = values.length
      ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
      : 0;
    bc.status = bc.totalScore >= 70 ? 'APPROVED' : 'REJECTED';
    return this.repo.save(bc);
  }

  getCriteria(): string[] {
    return EVALUATION_CRITERIA;
  }
}
