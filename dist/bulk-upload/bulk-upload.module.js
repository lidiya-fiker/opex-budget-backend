"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkUploadModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
const branch_entity_1 = require("../entities/branch.entity");
const district_entity_1 = require("../entities/district.entity");
const user_entity_1 = require("../entities/user.entity");
const bulk_upload_service_1 = require("./bulk-upload.service");
const bulk_upload_controller_1 = require("./bulk-upload.controller");
let BulkUploadModule = class BulkUploadModule {
};
exports.BulkUploadModule = BulkUploadModule;
exports.BulkUploadModule = BulkUploadModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([opex_budget_entity_1.OpexBudget, branch_entity_1.Branch, district_entity_1.District, user_entity_1.User]),
            platform_express_1.MulterModule.register({ storage: undefined }),
        ],
        providers: [bulk_upload_service_1.BulkUploadService],
        controllers: [bulk_upload_controller_1.BulkUploadController],
        exports: [bulk_upload_service_1.BulkUploadService],
    })
], BulkUploadModule);
//# sourceMappingURL=bulk-upload.module.js.map