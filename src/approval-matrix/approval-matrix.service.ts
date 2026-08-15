import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalMatrix } from '../entities/approval-matrix.entity';

@Injectable()
export class ApprovalMatrixService {
  constructor(
    @InjectRepository(ApprovalMatrix)
    private readonly repo: Repository<ApprovalMatrix>,
  ) {}

  async findByType(requestType: string): Promise<ApprovalMatrix[]> {
    return this.repo.find({
      where: { requestType },
      order: { level: 'ASC' },
    });
  }

  async findAll(): Promise<ApprovalMatrix[]> {
    return this.repo.find({ order: { requestType: 'ASC', level: 'ASC' } });
  }

  async create(data: Partial<ApprovalMatrix>): Promise<ApprovalMatrix> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<ApprovalMatrix>): Promise<ApprovalMatrix | null> {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  /**
   * Returns the ordered list of approver roles for a given request type.
   * This drives the multi-tier approval routing engine.
   */
  async getApprovalChain(requestType: string): Promise<string[]> {
    const matrix = await this.findByType(requestType);
    return matrix.map((m) => m.role);
  }
}
