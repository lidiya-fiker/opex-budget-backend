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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreBankingLog = exports.CoreBankingTransaction = void 0;
const typeorm_1 = require("typeorm");
const opex_budget_entity_1 = require("./opex-budget.entity");
let CoreBankingTransaction = class CoreBankingTransaction {
    id;
    transactionDate;
    glNumber;
    costCenterCode;
    amount;
    description;
    isMapped;
    mappedBudget;
    createdAt;
};
exports.CoreBankingTransaction = CoreBankingTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CoreBankingTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], CoreBankingTransaction.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CoreBankingTransaction.prototype, "glNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CoreBankingTransaction.prototype, "costCenterCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], CoreBankingTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CoreBankingTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CoreBankingTransaction.prototype, "isMapped", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => opex_budget_entity_1.OpexBudget, { nullable: true, eager: true }),
    __metadata("design:type", Object)
], CoreBankingTransaction.prototype, "mappedBudget", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CoreBankingTransaction.prototype, "createdAt", void 0);
exports.CoreBankingTransaction = CoreBankingTransaction = __decorate([
    (0, typeorm_1.Entity)('core_banking_transactions')
], CoreBankingTransaction);
let CoreBankingLog = class CoreBankingLog {
    id;
    runTime;
    status;
    recordsExtracted;
    errorMessage;
};
exports.CoreBankingLog = CoreBankingLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CoreBankingLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], CoreBankingLog.prototype, "runTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CoreBankingLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], CoreBankingLog.prototype, "recordsExtracted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CoreBankingLog.prototype, "errorMessage", void 0);
exports.CoreBankingLog = CoreBankingLog = __decorate([
    (0, typeorm_1.Entity)('core_banking_logs')
], CoreBankingLog);
//# sourceMappingURL=core-banking.entity.js.map