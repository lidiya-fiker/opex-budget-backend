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
var CbsAdapterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CbsAdapterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const core_banking_entity_1 = require("../entities/core-banking.entity");
const branch_budget_allocation_entity_1 = require("../entities/branch-budget-allocation.entity");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
const branch_entity_1 = require("../entities/branch.entity");
const gl_account_entity_1 = require("../entities/gl-account.entity");
const opex_alert_entity_1 = require("../entities/opex-alert.entity");
const notification_entity_1 = require("../entities/notification.entity");
const user_entity_1 = require("../entities/user.entity");
let CbsAdapterService = CbsAdapterService_1 = class CbsAdapterService {
    txRepo;
    logRepo;
    allocRepo;
    opexRepo;
    branchRepo;
    glRepo;
    alertRepo;
    notifRepo;
    userRepo;
    logger = new common_1.Logger(CbsAdapterService_1.name);
    constructor(txRepo, logRepo, allocRepo, opexRepo, branchRepo, glRepo, alertRepo, notifRepo, userRepo) {
        this.txRepo = txRepo;
        this.logRepo = logRepo;
        this.allocRepo = allocRepo;
        this.opexRepo = opexRepo;
        this.branchRepo = branchRepo;
        this.glRepo = glRepo;
        this.alertRepo = alertRepo;
        this.notifRepo = notifRepo;
        this.userRepo = userRepo;
    }
    async processIncomingTransactions(inputs) {
        const startTime = new Date();
        let mapped = 0;
        let unmapped = 0;
        let duplicates = 0;
        for (const input of inputs) {
            const refNum = input.referenceNumber || `CBS_REF_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            const existingTx = await this.txRepo.findOne({ where: { referenceNumber: refNum } });
            if (existingTx) {
                duplicates++;
                continue;
            }
            const bankingType = input.bankingType || 'CONVENTIONAL';
            const txDate = new Date(input.transactionDate);
            const valDate = input.valueDate ? new Date(input.valueDate) : txDate;
            const branch = await this.branchRepo.findOne({ where: { code: input.costCenterCode } });
            if (branch && branch.isClosed) {
                const closedTx = this.txRepo.create({
                    referenceNumber: refNum,
                    transactionDate: txDate,
                    valueDate: valDate,
                    costCenterCode: input.costCenterCode,
                    glNumber: input.glCode,
                    bankingType,
                    amount: input.amount,
                    description: `${input.description} [WARNING: CLOSED BRANCH ${branch.name}]`,
                    isMapped: false,
                    status: 'UNMAPPED',
                    rawPayload: JSON.stringify(input),
                });
                await this.txRepo.save(closedTx);
                unmapped++;
                await this.notifyAdmins(`⚠️ CBS Transaction received for CLOSED Branch ${branch.name} (${branch.code}). Amount: ${input.amount} ETB.`);
                continue;
            }
            const allocation = await this.allocRepo.findOne({
                where: {
                    branch: { code: input.costCenterCode },
                    glCode: input.glCode,
                    bankingType,
                    isBaseline: false,
                },
            });
            const opexBudget = await this.opexRepo.findOne({
                where: {
                    glNumber: input.glCode,
                    status: 'APPROVED',
                },
            });
            const isMapped = !!(allocation || opexBudget);
            const tx = this.txRepo.create({
                referenceNumber: refNum,
                transactionDate: txDate,
                valueDate: valDate,
                costCenterCode: input.costCenterCode,
                glNumber: input.glCode,
                bankingType,
                amount: input.amount,
                description: input.description,
                isMapped,
                status: isMapped ? 'MAPPED' : 'UNMAPPED',
                mappedAllocation: allocation || null,
                mappedBudget: opexBudget || null,
                rawPayload: JSON.stringify(input),
            });
            const savedTx = await this.txRepo.save(tx);
            if (allocation) {
                allocation.actualAmount = Number(allocation.actualAmount || 0) + Number(input.amount);
                await this.allocRepo.save(allocation);
                mapped++;
            }
            else if (opexBudget) {
                opexBudget.actualAmount = Number(opexBudget.actualAmount || 0) + Number(input.amount);
                await this.opexRepo.save(opexBudget);
                mapped++;
            }
            else {
                unmapped++;
            }
        }
        const log = this.logRepo.create({
            runTime: startTime,
            status: 'SUCCESS',
            recordsExtracted: inputs.length,
        });
        await this.logRepo.save(log);
        return { processed: inputs.length, mapped, unmapped, duplicates };
    }
    async getUnmappedTransactions() {
        return this.txRepo.find({
            where: { status: 'UNMAPPED' },
            order: { transactionDate: 'DESC' },
        });
    }
    async manualMapTransaction(txId, allocationId, opexBudgetId) {
        const tx = await this.txRepo.findOne({ where: { id: txId } });
        if (!tx)
            throw new common_1.BadRequestException(`Transaction ${txId} not found`);
        if (allocationId) {
            const alloc = await this.allocRepo.findOne({ where: { id: allocationId } });
            if (!alloc)
                throw new common_1.BadRequestException(`Allocation ${allocationId} not found`);
            alloc.actualAmount = Number(alloc.actualAmount || 0) + Number(tx.amount);
            await this.allocRepo.save(alloc);
            tx.mappedAllocation = alloc;
        }
        if (opexBudgetId) {
            const opex = await this.opexRepo.findOne({ where: { id: opexBudgetId } });
            if (!opex)
                throw new common_1.BadRequestException(`OPEX Budget ${opexBudgetId} not found`);
            opex.actualAmount = Number(opex.actualAmount || 0) + Number(tx.amount);
            await this.opexRepo.save(opex);
            tx.mappedBudget = opex;
        }
        tx.isMapped = true;
        tx.status = 'MAPPED';
        return this.txRepo.save(tx);
    }
    async processTemplateUpload(buffer) {
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
        if (!rows.length)
            throw new common_1.BadRequestException('Uploaded CBS template file is empty');
        const inputs = [];
        const errors = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                const costCenterCode = String(row['Code(branch code or MIS code)'] ||
                    row['Code'] ||
                    row['branch code'] ||
                    row['MIS code'] ||
                    row['costCenterCode'] ||
                    row['Branch Code'] ||
                    '').trim();
                const glCode = String(row['GL ACCOUNT'] ||
                    row['GL Account'] ||
                    row['glCode'] ||
                    row['GL'] ||
                    '').trim();
                const glDescription = String(row['GL DISCRIPTION'] ||
                    row['GL Description'] ||
                    row['description'] ||
                    'CBS Expense Posting').trim();
                const txDateRaw = row['Transaction date'] || row['Transaction Date'] || row['Date'] || new Date();
                const txDate = txDateRaw ? new Date(txDateRaw) : new Date();
                const amount = Number(row['Amount/montly'] ||
                    row['Amount'] ||
                    row['amount'] ||
                    0);
                const bankTypeRaw = String(row['Bank type'] ||
                    row['Banking Type'] ||
                    row['bankingType'] ||
                    'Conv').toUpperCase().trim();
                const bankingType = bankTypeRaw.includes('IFB') ? 'IFB' : 'CONVENTIONAL';
                const refNum = `CBS_FILE_${i + 1}_${costCenterCode}_${glCode}_${Date.now()}`;
                if (!costCenterCode || !glCode) {
                    errors.push(`Row ${i + 2}: Missing Cost Center Code or GL Account`);
                    continue;
                }
                inputs.push({
                    referenceNumber: refNum,
                    transactionDate: txDate,
                    costCenterCode,
                    glCode,
                    bankingType,
                    amount,
                    description: glDescription,
                });
            }
            catch (err) {
                errors.push(`Row ${i + 2}: ${err.message}`);
            }
        }
        const result = await this.processIncomingTransactions(inputs);
        return {
            ...result,
            errors,
        };
    }
    async notifyAdmins(message) {
        const admins = await this.userRepo.find({ where: { role: user_entity_1.Role.ADMIN } });
        const bccs = await this.userRepo.find({ where: { role: user_entity_1.Role.BCC_TEAM } });
        for (const u of [...admins, ...bccs]) {
            const notif = this.notifRepo.create({
                user: u,
                message,
                isRead: false,
            });
            await this.notifRepo.save(notif);
        }
    }
};
exports.CbsAdapterService = CbsAdapterService;
exports.CbsAdapterService = CbsAdapterService = CbsAdapterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(core_banking_entity_1.CoreBankingTransaction)),
    __param(1, (0, typeorm_1.InjectRepository)(core_banking_entity_1.CoreBankingLog)),
    __param(2, (0, typeorm_1.InjectRepository)(branch_budget_allocation_entity_1.BranchBudgetAllocation)),
    __param(3, (0, typeorm_1.InjectRepository)(opex_budget_entity_1.OpexBudget)),
    __param(4, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(5, (0, typeorm_1.InjectRepository)(gl_account_entity_1.GlAccount)),
    __param(6, (0, typeorm_1.InjectRepository)(opex_alert_entity_1.OpexAlert)),
    __param(7, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(8, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CbsAdapterService);
//# sourceMappingURL=cbs-adapter.service.js.map