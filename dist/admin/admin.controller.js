"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const district_entity_1 = require("../entities/district.entity");
const branch_entity_1 = require("../entities/branch.entity");
const user_entity_1 = require("../entities/user.entity");
const department_entity_1 = require("../entities/department.entity");
let AdminController = class AdminController {
    districtRepo;
    branchRepo;
    userRepo;
    departmentRepo;
    constructor(districtRepo, branchRepo, userRepo, departmentRepo) {
        this.districtRepo = districtRepo;
        this.branchRepo = branchRepo;
        this.userRepo = userRepo;
        this.departmentRepo = departmentRepo;
    }
    async getDepartments() {
        return this.departmentRepo.find();
    }
    async getDistricts() {
        return this.districtRepo.find({ relations: ['branches'] });
    }
    async createDistrict(body) {
        const district = this.districtRepo.create(body);
        return this.districtRepo.save(district);
    }
    async updateDistrict(id, body) {
        await this.districtRepo.update(id, body);
        return this.districtRepo.findOne({ where: { id }, relations: ['branches'] });
    }
    async deleteDistrict(id) {
        await this.districtRepo.delete(id);
        return { deleted: true };
    }
    async getBranches() {
        return this.branchRepo.find({ relations: ['district'] });
    }
    async createBranch(body) {
        const district = await this.districtRepo.findOne({ where: { id: body.districtId } });
        if (!district)
            throw new common_1.HttpException('District not found', common_1.HttpStatus.NOT_FOUND);
        const branch = this.branchRepo.create({ name: body.name, code: body.code, district });
        return this.branchRepo.save(branch);
    }
    async updateBranch(id, body) {
        const branch = await this.branchRepo.findOne({ where: { id }, relations: ['district'] });
        if (!branch)
            throw new common_1.HttpException('Branch not found', common_1.HttpStatus.NOT_FOUND);
        if (body.districtId) {
            const district = await this.districtRepo.findOne({ where: { id: body.districtId } });
            if (district)
                branch.district = district;
        }
        if (body.name)
            branch.name = body.name;
        if (body.code)
            branch.code = body.code;
        return this.branchRepo.save(branch);
    }
    async deleteBranch(id) {
        await this.branchRepo.delete(id);
        return { deleted: true };
    }
    async getUsers() {
        const users = await this.userRepo.find({ relations: ['branch', 'district'] });
        return users.map(u => ({ ...u, passwordHash: undefined }));
    }
    async createUser(body) {
        const existing = await this.userRepo.findOne({ where: { email: body.email } });
        if (existing)
            throw new common_1.HttpException('Email already exists', common_1.HttpStatus.CONFLICT);
        const passwordHash = await bcrypt.hash(body.password, 10);
        const user = this.userRepo.create({
            email: body.email,
            displayName: body.displayName,
            passwordHash,
            role: body.role,
        });
        if (body.branchId) {
            const branch = await this.branchRepo.findOne({ where: { id: body.branchId } });
            if (branch)
                user.branch = branch;
        }
        if (body.districtId) {
            const district = await this.districtRepo.findOne({ where: { id: body.districtId } });
            if (district)
                user.district = district;
        }
        const saved = await this.userRepo.save(user);
        return { ...saved, passwordHash: undefined };
    }
    async updateUser(id, body) {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['branch', 'district'] });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        if (body.email)
            user.email = body.email;
        if (body.displayName)
            user.displayName = body.displayName;
        if (body.role)
            user.role = body.role;
        if (body.password)
            user.passwordHash = await bcrypt.hash(body.password, 10);
        if (body.branchId) {
            const branch = await this.branchRepo.findOne({ where: { id: body.branchId } });
            if (branch)
                user.branch = branch;
        }
        if (body.districtId) {
            const district = await this.districtRepo.findOne({ where: { id: body.districtId } });
            if (district)
                user.district = district;
        }
        const saved = await this.userRepo.save(user);
        return { ...saved, passwordHash: undefined };
    }
    async deleteUser(id) {
        await this.userRepo.delete(id);
        return { deleted: true };
    }
    getRoles() {
        return Object.values(user_entity_1.Role);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('departments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Get)('districts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDistricts", null);
__decorate([
    (0, common_1.Post)('districts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createDistrict", null);
__decorate([
    (0, common_1.Put)('districts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDistrict", null);
__decorate([
    (0, common_1.Delete)('districts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteDistrict", null);
__decorate([
    (0, common_1.Get)('branches'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBranches", null);
__decorate([
    (0, common_1.Post)('branches'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createBranch", null);
__decorate([
    (0, common_1.Put)('branches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateBranch", null);
__decorate([
    (0, common_1.Delete)('branches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteBranch", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRoles", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __param(0, (0, typeorm_1.InjectRepository)(district_entity_1.District)),
    __param(1, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminController);
//# sourceMappingURL=admin.controller.js.map