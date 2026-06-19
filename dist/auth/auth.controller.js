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
exports.AuthController = exports.LdapAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const seed_service_1 = require("../seed/seed.service");
let LdapAuthGuard = class LdapAuthGuard extends (0, passport_1.AuthGuard)('ldap') {
    seedService;
    constructor(seedService) {
        super();
        this.seedService = seedService;
    }
    async canActivate(context) {
        try {
            await this.seedService.seedIfNeeded();
        }
        catch (e) {
        }
        return super.canActivate(context);
    }
};
exports.LdapAuthGuard = LdapAuthGuard;
exports.LdapAuthGuard = LdapAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [seed_service_1.SeedService])
], LdapAuthGuard);
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async loginLdap(req) {
        return this.authService.login(req.user);
    }
    async loginLocal(body) {
        const user = await this.authService.validateUserLocal(body.email, body.password);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return this.authService.login(user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(LdapAuthGuard),
    (0, common_1.Post)('login/ldap'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginLdap", null);
__decorate([
    (0, common_1.Post)('login/local'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginLocal", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map