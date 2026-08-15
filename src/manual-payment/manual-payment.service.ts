import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManualPayment, ManualPaymentStatus } from '../entities/manual-payment.entity';
import { CreateManualPaymentDto } from '../dto/create-manual-payment.dto';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ManualPaymentService {
  constructor(
    @InjectRepository(ManualPayment)
    private readonly manualPaymentRepo: Repository<ManualPayment>,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateManualPaymentDto, requesterId: number): Promise<ManualPayment> {
    const payment = this.manualPaymentRepo.create({
      ...dto,
      requesterId,
      status: ManualPaymentStatus.PENDING,
    });
    return await this.manualPaymentRepo.save(payment);
  }

  async approve(id: number): Promise<ManualPayment> {
    const payment = await this.manualPaymentRepo.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Manual payment not found');
    }
    if (payment.status !== ManualPaymentStatus.PENDING) {
      throw new BadRequestException('Only pending payments can be approved');
    }
    payment.status = ManualPaymentStatus.APPROVED;
    payment.confirmationToken = uuidv4();
    const saved = await this.manualPaymentRepo.save(payment);

    // Send confirmation email with CBS payment link
    // In production, requester email would come from User entity lookup
    const requesterEmail = `user${payment.requesterId}@dashenbank.com.et`;
    await this.emailService.sendManualPaymentConfirmation(
      requesterEmail,
      payment.budgetCode,
      payment.description,
      saved.confirmationToken!, // guaranteed non-null — just set above with uuidv4()
    ).catch((err) => console.error('Email send failed:', err.message));

    return saved;
  }

  async confirm(token: string): Promise<ManualPayment> {
    const payment = await this.manualPaymentRepo.findOne({ where: { confirmationToken: token } });
    if (!payment) {
      throw new NotFoundException('Invalid confirmation token');
    }
    if (payment.status !== ManualPaymentStatus.APPROVED) {
      throw new BadRequestException('Payment is not in an approvable state');
    }
    payment.status = ManualPaymentStatus.CONFIRMED;
    payment.confirmationToken = null;
    return await this.manualPaymentRepo.save(payment);
  }

  async findAll(): Promise<ManualPayment[]> {
    return await this.manualPaymentRepo.find({
      order: { id: 'DESC' },
    });
  }

  async getBreakdown(): Promise<{ paymentType: string; count: number; totalAmount: number }[]> {
    const result = await this.manualPaymentRepo
      .createQueryBuilder('payment')
      .select('payment.paymentType', 'paymentType')
      .addSelect('COUNT(payment.id)', 'count')
      .addSelect('SUM(payment.amount)', 'totalAmount')
      .groupBy('payment.paymentType')
      .getRawMany();

    return result.map(row => ({
      paymentType: row.paymentType || 'OTHER',
      count: parseInt(row.count, 10),
      totalAmount: parseFloat(row.totalAmount || '0'),
    }));
  }
}
