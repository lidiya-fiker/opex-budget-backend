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
exports.ManualPaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manual_payment_entity_1 = require("../entities/manual-payment.entity");
const email_service_1 = require("../email/email.service");
const uuid_1 = require("uuid");
let ManualPaymentService = class ManualPaymentService {
    manualPaymentRepo;
    emailService;
    constructor(manualPaymentRepo, emailService) {
        this.manualPaymentRepo = manualPaymentRepo;
        this.emailService = emailService;
    }
    async create(dto, requesterId) {
        const payment = this.manualPaymentRepo.create({
            ...dto,
            requesterId,
            status: manual_payment_entity_1.ManualPaymentStatus.PENDING,
        });
        return await this.manualPaymentRepo.save(payment);
    }
    async approve(id) {
        const payment = await this.manualPaymentRepo.findOne({ where: { id } });
        if (!payment) {
            throw new common_1.NotFoundException('Manual payment not found');
        }
        if (payment.status !== manual_payment_entity_1.ManualPaymentStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending payments can be approved');
        }
        payment.status = manual_payment_entity_1.ManualPaymentStatus.APPROVED;
        payment.confirmationToken = (0, uuid_1.v4)();
        const saved = await this.manualPaymentRepo.save(payment);
        const requesterEmail = `user${payment.requesterId}@dashenbank.com.et`;
        await this.emailService.sendManualPaymentConfirmation(requesterEmail, payment.budgetCode, payment.description, saved.confirmationToken).catch((err) => console.error('Email send failed:', err.message));
        return saved;
    }
    async confirm(token) {
        const payment = await this.manualPaymentRepo.findOne({ where: { confirmationToken: token } });
        if (!payment) {
            throw new common_1.NotFoundException('Invalid confirmation token');
        }
        if (payment.status !== manual_payment_entity_1.ManualPaymentStatus.APPROVED) {
            throw new common_1.BadRequestException('Payment is not in an approvable state');
        }
        payment.status = manual_payment_entity_1.ManualPaymentStatus.CONFIRMED;
        payment.confirmationToken = null;
        return await this.manualPaymentRepo.save(payment);
    }
    async findAll() {
        return await this.manualPaymentRepo.find({
            order: { id: 'DESC' },
        });
    }
    async getBreakdown() {
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
};
exports.ManualPaymentService = ManualPaymentService;
exports.ManualPaymentService = ManualPaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manual_payment_entity_1.ManualPayment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService])
], ManualPaymentService);
//# sourceMappingURL=manual-payment.service.js.map