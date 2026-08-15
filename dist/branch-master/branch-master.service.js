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
var BranchMasterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchMasterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const branch_entity_1 = require("../entities/branch.entity");
const district_entity_1 = require("../entities/district.entity");
const XLSX = __importStar(require("xlsx"));
let BranchMasterService = BranchMasterService_1 = class BranchMasterService {
    branchRepo;
    districtRepo;
    logger = new common_1.Logger(BranchMasterService_1.name);
    constructor(branchRepo, districtRepo) {
        this.branchRepo = branchRepo;
        this.districtRepo = districtRepo;
    }
    async findAll(filters) {
        const qb = this.branchRepo.createQueryBuilder('b')
            .leftJoinAndSelect('b.district', 'district')
            .leftJoinAndSelect('b.department', 'department');
        if (filters.districtName) {
            qb.andWhere('district.name = :districtName', { districtName: filters.districtName });
        }
        if (filters.region) {
            qb.andWhere('(b.region = :region OR district.region = :region)', { region: filters.region });
        }
        if (filters.bankingType) {
            qb.andWhere('b.bankingType = :bt', { bt: filters.bankingType });
        }
        if (filters.isClosed !== undefined) {
            qb.andWhere('b.isClosed = :ic', { ic: filters.isClosed });
        }
        if (filters.search) {
            qb.andWhere('(b.name LIKE :s OR b.code LIKE :s OR b.city LIKE :s OR b.area LIKE :s)', { s: `%${filters.search}%` });
        }
        qb.orderBy('b.name', 'ASC');
        return qb.getMany();
    }
    async findByCode(code) {
        return this.branchRepo.findOne({
            where: { code },
            relations: ['district', 'department'],
        });
    }
    async processBranchMasterImport(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
        if (!rows.length)
            throw new common_1.BadRequestException('Uploaded branch master file is empty');
        let inserted = 0;
        let updated = 0;
        const errors = [];
        const districtCache = new Map();
        const existingDistricts = await this.districtRepo.find();
        existingDistricts.forEach((d) => districtCache.set(d.name.toLowerCase().trim(), d));
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                const branchCode = String(row['Branch Code'] || row['code'] || row['BranchCode'] || row['Code'] || '').trim();
                const branchName = String(row['Branch Name'] || row['name'] || row['BranchName'] || row['Branch'] || '').trim();
                const districtName = String(row['District'] || row['district'] || row['DistrictName'] || 'Main District').trim();
                const area = row['Area'] || row['area'] || null;
                const region = row['Region'] || row['region'] || null;
                const zone = row['Zone'] || row['zone'] || null;
                const city = row['City'] || row['city'] || null;
                const phoneNumber = row['Phone Number'] || row['Phone'] || row['phoneNumber'] || null;
                const bankingTypeRaw = String(row['Banking Type'] || row['bankingType'] || 'CONVENTIONAL').toUpperCase().trim();
                const bankingType = bankingTypeRaw.includes('IFB') ? 'IFB' : bankingTypeRaw.includes('HYBRID') ? 'HYBRID' : 'CONVENTIONAL';
                if (!branchCode || !branchName) {
                    errors.push(`Row ${i + 2}: Missing Branch Code or Branch Name`);
                    continue;
                }
                const normDistName = districtName.toLowerCase().trim();
                let district = districtCache.get(normDistName);
                if (!district) {
                    district = this.districtRepo.create({
                        name: districtName,
                        code: 'DIST_' + districtName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10),
                        region: region || null,
                    });
                    district = await this.districtRepo.save(district);
                    districtCache.set(normDistName, district);
                }
                const existingBranch = await this.branchRepo.findOne({ where: { code: branchCode } });
                if (existingBranch) {
                    existingBranch.name = branchName;
                    existingBranch.district = district;
                    existingBranch.area = area;
                    existingBranch.region = region;
                    existingBranch.zone = zone;
                    existingBranch.city = city;
                    existingBranch.phoneNumber = phoneNumber;
                    existingBranch.bankingType = bankingType;
                    await this.branchRepo.save(existingBranch);
                    updated++;
                }
                else {
                    const newBranch = this.branchRepo.create({
                        code: branchCode,
                        name: branchName,
                        district,
                        area,
                        region,
                        zone,
                        city,
                        phoneNumber,
                        bankingType: bankingType,
                        isClosed: false,
                    });
                    await this.branchRepo.save(newBranch);
                    inserted++;
                }
            }
            catch (err) {
                errors.push(`Row ${i + 2}: ${err.message}`);
            }
        }
        return { inserted, updated, errors };
    }
    async closeBranch(code, isClosed = true) {
        const branch = await this.branchRepo.findOne({ where: { code } });
        if (!branch)
            throw new common_1.BadRequestException(`Branch ${code} not found`);
        branch.isClosed = isClosed;
        return this.branchRepo.save(branch);
    }
};
exports.BranchMasterService = BranchMasterService;
exports.BranchMasterService = BranchMasterService = BranchMasterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(1, (0, typeorm_1.InjectRepository)(district_entity_1.District)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BranchMasterService);
//# sourceMappingURL=branch-master.service.js.map