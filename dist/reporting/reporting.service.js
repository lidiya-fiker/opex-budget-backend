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
exports.ReportingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
const manual_payment_entity_1 = require("../entities/manual-payment.entity");
const XLSX = __importStar(require("xlsx"));
let ReportingService = class ReportingService {
    opexRepo;
    paymentRepo;
    constructor(opexRepo, paymentRepo) {
        this.opexRepo = opexRepo;
        this.paymentRepo = paymentRepo;
    }
    async getBvaReport(level, unitId, cycleId) {
        const qb = this.opexRepo.createQueryBuilder('ob');
        if (cycleId)
            qb.andWhere('ob.budgetCycleId = :cycleId', { cycleId });
        switch (level) {
            case 'BANK':
                break;
            case 'DISTRICT':
                if (unitId)
                    qb.andWhere('ob.districtId = :unitId', { unitId });
                break;
            case 'BRANCH':
                if (unitId)
                    qb.andWhere('ob.branchId = :unitId', { unitId });
                break;
            case 'BUDGET_OWNER':
                if (unitId)
                    qb.andWhere('ob.ownerId = :unitId', { unitId });
                break;
            default:
                break;
        }
        const records = await qb.getMany();
        const totalBudget = records.reduce((s, r) => s + Number(r.annualAmount), 0);
        const totalActuals = 0;
        return {
            level,
            unitId,
            cycleId,
            totalBudget,
            totalActuals,
            remaining: totalBudget - totalActuals,
            utilizationPct: totalBudget > 0 ? ((totalActuals / totalBudget) * 100).toFixed(2) : '0',
            lineItems: records,
        };
    }
    async exportBvaReport(level, unitId, cycleId) {
        const data = await this.getBvaReport(level, unitId, cycleId);
        const rows = data.lineItems.map(item => ({
            'GL Number': item.glNumber,
            'GL Description': item.glDescription,
            'Annual Amount': item.annualAmount,
            'M1': item.m1,
            'M2': item.m2,
            'M3': item.m3,
            'M4': item.m4,
            'M5': item.m5,
            'M6': item.m6,
            'M7': item.m7,
            'M8': item.m8,
            'M9': item.m9,
            'M10': item.m10,
            'M11': item.m11,
            'M12': item.m12,
            'Status': item.status,
            'Fiscal Year': item.fiscalYear,
            'Level': item.level,
        }));
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'BVA Report');
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        return buffer;
    }
    async getManualPaymentDashboard() {
        const payments = await this.paymentRepo.find();
        const grouped = {};
        for (const p of payments) {
            const type = p.budgetCode || 'OTHER';
            if (!grouped[type])
                grouped[type] = { count: 0, total: 0 };
            grouped[type].count++;
            grouped[type].total += Number(p.amount);
        }
        return grouped;
    }
};
exports.ReportingService = ReportingService;
exports.ReportingService = ReportingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(opex_budget_entity_1.OpexBudget)),
    __param(1, (0, typeorm_1.InjectRepository)(manual_payment_entity_1.ManualPayment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReportingService);
//# sourceMappingURL=reporting.service.js.map