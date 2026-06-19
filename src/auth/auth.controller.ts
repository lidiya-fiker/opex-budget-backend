import { Controller, Request, Post, UseGuards, Body, UnauthorizedException, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SeedService } from '../seed/seed.service';

@Injectable()
export class LdapAuthGuard extends AuthGuard('ldap') {
  constructor(private seedService: SeedService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await this.seedService.seedIfNeeded();
    } catch (e) {
      // Ignore if seeding fails to avoid blocking the login attempt
    }
    return super.canActivate(context) as Promise<boolean>;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LdapAuthGuard)
  @Post('login/ldap')
  async loginLdap(@Request() req) {
    return this.authService.login(req.user);
  }

  // Local login mock for easier local development without an LDAP server
  @Post('login/local')
  async loginLocal(@Body() body) {
    const user = await this.authService.validateUserLocal(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}
