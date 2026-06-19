import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy = require('passport-ldapauth');
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  private readonly logger = new Logger(LdapStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      server: {
        url: configService.get<string>('LDAP_URL') || 'ldap://localhost:3890',
        bindDN: configService.get<string>('LDAP_BIND_DN') || 'uid=admin,ou=people,dc=dashen,dc=com',
        bindCredentials: configService.get<string>('LDAP_BIND_CREDENTIALS') || 'DashenAdmin@2026',
        searchBase: configService.get<string>('LDAP_SEARCH_BASE') || 'ou=people,dc=dashen,dc=com',
        searchFilter: '(uid={{username}})',
        searchAttributes: ['uid', 'mail', 'displayName', 'memberOf', 'cn'],
      },
    });
  }

  async validate(user: any) {
    if (!user) {
      throw new UnauthorizedException();
    }

    this.logger.debug(`LDAP user validated: ${JSON.stringify(user)}`);

    // LLDAP returns email in the 'mail' attribute
    // uid is the username (e.g. 'bole.finance')
    // Reconstruct the full email as stored in Postgres
    const uid = user.uid || user.cn || '';
    const email = user.mail || `${uid}@dashen.com`;

    return {
      email,
      username: uid,
      displayName: user.displayName || uid,
    };
  }
}
