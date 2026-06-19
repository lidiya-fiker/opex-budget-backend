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
var LdapStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LdapStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const Strategy = require("passport-ldapauth");
const config_1 = require("@nestjs/config");
let LdapStrategy = LdapStrategy_1 = class LdapStrategy extends (0, passport_1.PassportStrategy)(Strategy, 'ldap') {
    configService;
    logger = new common_1.Logger(LdapStrategy_1.name);
    constructor(configService) {
        super({
            server: {
                url: configService.get('LDAP_URL') || 'ldap://localhost:3890',
                bindDN: configService.get('LDAP_BIND_DN') || 'uid=admin,ou=people,dc=dashen,dc=com',
                bindCredentials: configService.get('LDAP_BIND_CREDENTIALS') || 'DashenAdmin@2026',
                searchBase: configService.get('LDAP_SEARCH_BASE') || 'ou=people,dc=dashen,dc=com',
                searchFilter: '(uid={{username}})',
                searchAttributes: ['uid', 'mail', 'displayName', 'memberOf', 'cn'],
            },
        });
        this.configService = configService;
    }
    async validate(user) {
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        this.logger.debug(`LDAP user validated: ${JSON.stringify(user)}`);
        const uid = user.uid || user.cn || '';
        const email = user.mail || `${uid}@dashen.com`;
        return {
            email,
            username: uid,
            displayName: user.displayName || uid,
        };
    }
};
exports.LdapStrategy = LdapStrategy;
exports.LdapStrategy = LdapStrategy = LdapStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LdapStrategy);
//# sourceMappingURL=ldap.strategy.js.map