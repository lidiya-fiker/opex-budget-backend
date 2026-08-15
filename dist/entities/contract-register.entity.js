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
exports.ContractRegister = void 0;
const typeorm_1 = require("typeorm");
let ContractRegister = class ContractRegister {
    id;
    contractType;
    vendorName;
    budgetCode;
    vendorContact;
    periodStart;
    periodEnd;
    amount;
    currency;
    status;
    createdAt;
    updatedAt;
};
exports.ContractRegister = ContractRegister;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContractRegister.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contract_type' }),
    __metadata("design:type", String)
], ContractRegister.prototype, "contractType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_name' }),
    __metadata("design:type", String)
], ContractRegister.prototype, "vendorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'budget_code', nullable: true }),
    __metadata("design:type", String)
], ContractRegister.prototype, "budgetCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_contact', nullable: true }),
    __metadata("design:type", String)
], ContractRegister.prototype, "vendorContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period_start', type: 'date' }),
    __metadata("design:type", Date)
], ContractRegister.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period_end', type: 'date' }),
    __metadata("design:type", Date)
], ContractRegister.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], ContractRegister.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], ContractRegister.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ACTIVE' }),
    __metadata("design:type", String)
], ContractRegister.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ContractRegister.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ContractRegister.prototype, "updatedAt", void 0);
exports.ContractRegister = ContractRegister = __decorate([
    (0, typeorm_1.Entity)('contract_register')
], ContractRegister);
//# sourceMappingURL=contract-register.entity.js.map