import Strategy = require('passport-ldapauth');
import { ConfigService } from '@nestjs/config';
declare const LdapStrategy_base: new (options: Strategy.Options | Strategy.OptionsFunction, verify?: Strategy.VerifyCallback | Strategy.VerifyCallbackWithRequest | undefined) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LdapStrategy extends LdapStrategy_base {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    validate(user: any): Promise<{
        email: any;
        username: any;
        displayName: any;
    }>;
}
export {};
