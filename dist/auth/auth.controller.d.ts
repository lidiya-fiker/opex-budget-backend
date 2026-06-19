import { ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SeedService } from '../seed/seed.service';
declare const LdapAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class LdapAuthGuard extends LdapAuthGuard_base {
    private seedService;
    constructor(seedService: SeedService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    loginLdap(req: any): Promise<{
        access_token: string;
    }>;
    loginLocal(body: any): Promise<{
        access_token: string;
    }>;
}
export {};
