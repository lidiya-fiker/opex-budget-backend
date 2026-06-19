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
exports.ExpenseCategoryController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_category_entity_1 = require("../entities/expense-category.entity");
const passport_1 = require("@nestjs/passport");
let ExpenseCategoryController = class ExpenseCategoryController {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async findAll() {
        return this.categoryRepo.find({ order: { name: 'ASC' } });
    }
    async createOrUpdate(data) {
        if (data.id) {
            await this.categoryRepo.update(data.id, {
                name: data.name,
                description: data.description,
                code: data.code,
                group: data.group,
                isMandatory: data.isMandatory
            });
            return this.categoryRepo.findOne({ where: { id: data.id } });
        }
        const { id, ...cleanData } = data;
        const category = this.categoryRepo.create(cleanData);
        return this.categoryRepo.save(category);
    }
    async remove(id) {
        await this.categoryRepo.delete(id);
        return { success: true };
    }
};
exports.ExpenseCategoryController = ExpenseCategoryController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpenseCategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpenseCategoryController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExpenseCategoryController.prototype, "remove", null);
exports.ExpenseCategoryController = ExpenseCategoryController = __decorate([
    (0, common_1.Controller)('expense-categories'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, typeorm_1.InjectRepository)(expense_category_entity_1.ExpenseCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExpenseCategoryController);
//# sourceMappingURL=expense-category.controller.js.map