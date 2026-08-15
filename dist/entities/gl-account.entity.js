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
exports.GlAccount = exports.BankingType = void 0;
const typeorm_1 = require("typeorm");
var BankingType;
(function (BankingType) {
    BankingType["CONVENTIONAL"] = "CONVENTIONAL";
    BankingType["IFB"] = "IFB";
})(BankingType || (exports.BankingType = BankingType = {}));
let GlAccount = class GlAccount {
    id;
    glCode;
    glDescription;
    bankingType;
    categoryGroup;
    isActive;
    createdAt;
};
exports.GlAccount = GlAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GlAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], GlAccount.prototype, "glCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GlAccount.prototype, "glDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'CONVENTIONAL' }),
    __metadata("design:type", String)
], GlAccount.prototype, "bankingType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], GlAccount.prototype, "categoryGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], GlAccount.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GlAccount.prototype, "createdAt", void 0);
exports.GlAccount = GlAccount = __decorate([
    (0, typeorm_1.Entity)('gl_accounts')
], GlAccount);
//# sourceMappingURL=gl-account.entity.js.map