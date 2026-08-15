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
exports.CapexController = void 0;
const common_1 = require("@nestjs/common");
const capex_service_1 = require("./capex.service");
let CapexController = class CapexController {
    service;
    constructor(service) {
        this.service = service;
    }
    getCriteria() {
        return this.service.getCriteria();
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(body) {
        return this.service.create(body);
    }
    score(id, evaluation) {
        return this.service.score(id, evaluation);
    }
};
exports.CapexController = CapexController;
__decorate([
    (0, common_1.Get)('criteria'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CapexController.prototype, "getCriteria", null);
__decorate([
    (0, common_1.Get)('business-cases'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CapexController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('business-cases/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CapexController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('business-cases'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CapexController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('business-cases/:id/score'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CapexController.prototype, "score", null);
exports.CapexController = CapexController = __decorate([
    (0, common_1.Controller)('capex'),
    __metadata("design:paramtypes", [capex_service_1.CapexService])
], CapexController);
//# sourceMappingURL=capex.controller.js.map