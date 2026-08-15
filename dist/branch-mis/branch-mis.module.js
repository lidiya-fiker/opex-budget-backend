"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchMisModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const branch_mis_mapping_entity_1 = require("../entities/branch-mis-mapping.entity");
const branch_mis_service_1 = require("./branch-mis.service");
const branch_mis_controller_1 = require("./branch-mis.controller");
let BranchMisModule = class BranchMisModule {
};
exports.BranchMisModule = BranchMisModule;
exports.BranchMisModule = BranchMisModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([branch_mis_mapping_entity_1.BranchMisMapping])],
        providers: [branch_mis_service_1.BranchMisService],
        controllers: [branch_mis_controller_1.BranchMisController],
        exports: [branch_mis_service_1.BranchMisService],
    })
], BranchMisModule);
//# sourceMappingURL=branch-mis.module.js.map