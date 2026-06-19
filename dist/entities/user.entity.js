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
exports.User = exports.Role = void 0;
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("./branch.entity");
const district_entity_1 = require("./district.entity");
var Role;
(function (Role) {
    Role["BRANCH_USER"] = "BRANCH_USER";
    Role["BRANCH_MANAGER"] = "BRANCH_MANAGER";
    Role["DISTRICT_MANAGER"] = "DISTRICT_MANAGER";
    Role["BCC_TEAM"] = "BCC_TEAM";
    Role["STRATEGY_OFFICER"] = "STRATEGY_OFFICER";
    Role["EXECUTIVE"] = "EXECUTIVE";
    Role["BOARD"] = "BOARD";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
let User = class User {
    id;
    email;
    displayName;
    passwordHash;
    role;
    branch;
    district;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: Role.BRANCH_USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, { nullable: true, eager: true }),
    __metadata("design:type", Object)
], User.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => district_entity_1.District, { nullable: true, eager: true }),
    __metadata("design:type", Object)
], User.prototype, "district", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map