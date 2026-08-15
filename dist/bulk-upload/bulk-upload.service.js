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
var BulkUploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkUploadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const opex_budget_entity_1 = require("../entities/opex-budget.entity");
const branch_entity_1 = require("../entities/branch.entity");
const district_entity_1 = require("../entities/district.entity");
const user_entity_1 = require("../entities/user.entity");
const XLSX = __importStar(require("xlsx"));
const bcrypt = __importStar(require("bcryptjs"));
let BulkUploadService = BulkUploadService_1 = class BulkUploadService {
    opexRepo;
    branchRepo;
    districtRepo;
    userRepo;
    logger = new common_1.Logger(BulkUploadService_1.name);
    constructor(opexRepo, branchRepo, districtRepo, userRepo) {
        this.opexRepo = opexRepo;
        this.branchRepo = branchRepo;
        this.districtRepo = districtRepo;
        this.userRepo = userRepo;
    }
    async processUpload(buffer, uploadType, uploadedBy, budgetCycleId) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
        if (!rows.length)
            throw new common_1.BadRequestException('Uploaded file is empty');
        const REQUIRED = ['glNumber', 'glDescription', 'fiscalYear', 'annualAmount'];
        const missing = REQUIRED.filter((k) => !(k in rows[0]));
        if (missing.length) {
            throw new common_1.BadRequestException(`Missing required columns: ${missing.join(', ')}`);
        }
        let inserted = 0;
        let updated = 0;
        const errors = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                const existing = await this.opexRepo.findOne({
                    where: { glNumber: row.glNumber, fiscalYear: row.fiscalYear },
                });
                const data = {
                    glNumber: row.glNumber,
                    glDescription: row.glDescription,
                    expenseCategory: row.expenseCategory || (uploadType === 'ifb' ? 'IFB' : 'CONVENTIONAL'),
                    fiscalYear: row.fiscalYear,
                    level: row.level || 'BRANCH',
                    annualAmount: Number(row.annualAmount),
                    m1: Number(row.m1 || 0),
                    m2: Number(row.m2 || 0),
                    m3: Number(row.m3 || 0),
                    m4: Number(row.m4 || 0),
                    m5: Number(row.m5 || 0),
                    m6: Number(row.m6 || 0),
                    m7: Number(row.m7 || 0),
                    m8: Number(row.m8 || 0),
                    m9: Number(row.m9 || 0),
                    m10: Number(row.m10 || 0),
                    m11: Number(row.m11 || 0),
                    m12: Number(row.m12 || 0),
                    status: uploadType === 'supplementary' ? 'PENDING' : 'PENDING',
                };
                if (existing) {
                    await this.opexRepo.update(existing.id, data);
                    updated++;
                }
                else {
                    await this.opexRepo.save(this.opexRepo.create(data));
                    inserted++;
                }
            }
            catch (err) {
                errors.push(`Row ${i + 2}: ${err.message}`);
            }
        }
        return { inserted, updated, errors };
    }
    async processDistrictPivotedUpload(buffer, uploadedBy, districtName, fiscalYear) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
        if (rawData.length < 3)
            throw new common_1.BadRequestException('Uploaded file does not have enough rows');
        let topHeadersRowIdx = -1;
        let subHeadersRowIdx = -1;
        for (let i = 0; i < Math.min(20, rawData.length); i++) {
            const rowStr = rawData[i].map(x => String(x || '').toUpperCase()).join(',');
            if (rowStr.includes('ACTUAL UTILIZATION') || rowStr.includes('BUDGET INPUTS'))
                topHeadersRowIdx = i;
            if (rowStr.includes('LINE ITEM')) {
                subHeadersRowIdx = i;
                break;
            }
        }
        if (subHeadersRowIdx === -1)
            throw new common_1.BadRequestException('Could not find LINE ITEM header row in Excel file');
        const topHeaders = topHeadersRowIdx !== -1 ? rawData[topHeadersRowIdx] : [];
        const subHeaders = rawData[subHeadersRowIdx];
        let district = await this.districtRepo.findOne({ where: { name: districtName } });
        if (!district) {
            district = await this.districtRepo.save(this.districtRepo.create({
                name: districtName,
                code: 'DIST_' + districtName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10),
            }));
            const username = districtName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.district';
            const pwHash = await bcrypt.hash('Password@123', 10);
            await this.userRepo.save(this.userRepo.create({
                email: `${username}@dashen.com`,
                displayName: `${districtName} Manager`,
                passwordHash: pwHash,
                role: user_entity_1.Role.DISTRICT_MANAGER,
                district: district,
            }));
        }
        const branches = await this.branchRepo.find({ where: { district: { id: district.id } } });
        const branchMap = new Map();
        branches.forEach(b => {
            branchMap.set(b.code.toUpperCase().trim(), b);
            branchMap.set(b.name.toLowerCase().replace(/branch/g, '').trim(), b);
        });
        let districtBudgetCol = -1;
        let districtActualCol = -1;
        const branchBudgetCols = [];
        const branchActualCols = [];
        const pwHashBranch = await bcrypt.hash('Password@123', 10);
        for (let c = 0; c < subHeaders.length; c++) {
            const topH = topHeaders[c] ? String(topHeaders[c]).toUpperCase() : '';
            const subH = subHeaders[c] ? String(subHeaders[c]).trim() : '';
            const combinedH = `${topH} ${subH.toUpperCase()}`;
            if (combinedH.includes('DISTRICT APPROVED'))
                districtBudgetCol = c;
            if (combinedH.includes('DISTRICT TOTAL ACTUAL'))
                districtActualCol = c;
            const codeMatch = subH.match(/\[([A-Za-z0-9_]+)\]/);
            const branchCode = codeMatch ? codeMatch[1].trim() : null;
            const nameMatch = subH.match(/^([A-Za-z0-9\s]+?)(?=\[|\d{2,}|ALLOCATED|ACTUAL|BRANCH|TOTAL|DISTRICT|\s*$)/i);
            const cleanBranchName = nameMatch ? nameMatch[1].replace(/branch/gi, '').trim() : subH.split('[')[0].trim();
            if (cleanBranchName && cleanBranchName.length > 1 && !cleanBranchName.toUpperCase().includes('DISTRICT') && !cleanBranchName.toUpperCase().includes('TOTAL')) {
                let branch = null;
                if (branchCode)
                    branch = branchMap.get(branchCode.toUpperCase()) || null;
                if (!branch)
                    branch = branchMap.get(cleanBranchName.toLowerCase()) || null;
                if (!branch) {
                    const newBranchCode = branchCode || 'BR_' + cleanBranchName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
                    branch = await this.branchRepo.save(this.branchRepo.create({
                        name: `${cleanBranchName} Branch`,
                        code: newBranchCode,
                        district,
                    }));
                    branchMap.set(newBranchCode.toUpperCase(), branch);
                    branchMap.set(cleanBranchName.toLowerCase(), branch);
                    const baseUser = cleanBranchName.toLowerCase().replace(/[^a-z0-9]/g, '');
                    await this.userRepo.save(this.userRepo.create({
                        email: `${baseUser}.manager@dashen.com`,
                        displayName: `${cleanBranchName} Branch Manager`,
                        passwordHash: pwHashBranch,
                        role: user_entity_1.Role.BRANCH_MANAGER,
                        branch,
                    }));
                }
                if (subH.toUpperCase().includes('ACTUAL') || topH.includes('ACTUAL UTILIZATION')) {
                    branchActualCols.push({ colIndex: c, branch });
                }
                else if (subH.toUpperCase().includes('ALLOCATED') || topH.includes('AUTO-ALLOCATED')) {
                    branchBudgetCols.push({ colIndex: c, branch });
                }
            }
        }
        if (districtBudgetCol === -1)
            districtBudgetCol = 1;
        if (districtActualCol === -1)
            districtActualCol = 2;
        let inserted = 0;
        let updated = 0;
        const errors = [];
        for (let r = subHeadersRowIdx + 1; r < rawData.length; r++) {
            const row = rawData[r];
            if (!row || row.length === 0)
                continue;
            const lineItem = row[0] ? String(row[0]).trim() : '';
            if (!lineItem || lineItem.startsWith('A.') || lineItem.startsWith('B.') || lineItem.startsWith('C.'))
                continue;
            const distBudget = Number(row[districtBudgetCol]) || 0;
            const distActual = Number(row[districtActualCol]) || 0;
            await this.upsertBudgetRow(lineItem, fiscalYear, 'DISTRICT', distBudget, distActual, district.id, null).then(res => {
                if (res === 'inserted')
                    inserted++;
                if (res === 'updated')
                    updated++;
            }).catch(err => errors.push(`Row ${r + 1} District: ${err.message}`));
            for (const col of branchBudgetCols) {
                const branchBudget = Number(row[col.colIndex]) || 0;
                const actualCol = branchActualCols.find(bc => bc.branch.id === col.branch.id);
                const branchActual = actualCol ? (Number(row[actualCol.colIndex]) || 0) : 0;
                await this.upsertBudgetRow(lineItem, fiscalYear, 'BRANCH', branchBudget, branchActual, district.id, col.branch.id).then(res => {
                    if (res === 'inserted')
                        inserted++;
                    if (res === 'updated')
                        updated++;
                }).catch(err => errors.push(`Row ${r + 1} Branch ${col.branch.id}: ${err.message}`));
            }
        }
        return { inserted, updated, errors };
    }
    async upsertBudgetRow(lineItem, fiscalYear, level, annualAmount, actualAmount, districtId, branchId) {
        const existing = await this.opexRepo.findOne({
            where: {
                glDescription: lineItem,
                fiscalYear,
                level,
                district: { id: districtId },
                branch: branchId ? { id: branchId } : (0, typeorm_2.IsNull)(),
            },
            relations: ['district', 'branch']
        });
        const data = {
            glNumber: 'N/A',
            glDescription: lineItem,
            expenseCategory: 'CONVENTIONAL',
            fiscalYear,
            level,
            annualAmount,
            actualAmount,
            district: { id: districtId },
            ...(branchId ? { branch: { id: branchId } } : {}),
            status: 'PENDING',
        };
        if (existing) {
            await this.opexRepo.update(existing.id, { annualAmount, actualAmount });
            return 'updated';
        }
        else {
            await this.opexRepo.save(this.opexRepo.create(data));
            return 'inserted';
        }
    }
};
exports.BulkUploadService = BulkUploadService;
exports.BulkUploadService = BulkUploadService = BulkUploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(opex_budget_entity_1.OpexBudget)),
    __param(1, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(2, (0, typeorm_1.InjectRepository)(district_entity_1.District)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BulkUploadService);
//# sourceMappingURL=bulk-upload.service.js.map