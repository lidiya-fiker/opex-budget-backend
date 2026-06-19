"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockGlService = void 0;
const common_1 = require("@nestjs/common");
let MockGlService = class MockGlService {
    async getActuals(branchId, categoryId, currency) {
        const seed = branchId * 1000 + categoryId;
        const baseAmount = (seed % 100) * 5000;
        const currencyModifier = currency === 'ETB' ? 1 :
            currency === 'USD' ? 120 :
                currency === 'EUR' ? 130 : 1;
        return baseAmount / currencyModifier;
    }
};
exports.MockGlService = MockGlService;
exports.MockGlService = MockGlService = __decorate([
    (0, common_1.Injectable)()
], MockGlService);
//# sourceMappingURL=mock-gl.service.js.map