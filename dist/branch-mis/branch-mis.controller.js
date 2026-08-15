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
exports.BranchMisController = void 0;
const common_1 = require("@nestjs/common");
const branch_mis_service_1 = require("./branch-mis.service");
let BranchMisController = class BranchMisController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    findActive() {
        return this.service.findActive();
    }
    findClosed() {
        return this.service.findClosed();
    }
    upsert(body) {
        return this.service.upsert(body);
    }
    close(code) {
        return this.service.closeUnit(code);
    }
};
exports.BranchMisController = BranchMisController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BranchMisController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BranchMisController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('closed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BranchMisController.prototype, "findClosed", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BranchMisController.prototype, "upsert", null);
__decorate([
    (0, common_1.Patch)(':code/close'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BranchMisController.prototype, "close", null);
exports.BranchMisController = BranchMisController = __decorate([
    (0, common_1.Controller)('branch-mis'),
    __metadata("design:paramtypes", [branch_mis_service_1.BranchMisService])
], BranchMisController);
//# sourceMappingURL=branch-mis.controller.js.map