import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { SeedService } from '../seed/seed.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private seedService: SeedService,
  ) {}

  async validateUserLocal(email: string, pass: string): Promise<any> {
    await this.seedService.seedIfNeeded();
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['branch', 'district'],
    });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    await this.seedService.seedIfNeeded();

    // Look up user in Postgres by email (seeded from DB)
    let dbUser = await this.userRepository.findOne({
      where: { email: user.email },
      relations: ['branch', 'district'],
    });

    if (!dbUser) {
      this.logger.warn(`LDAP user ${user.email} authenticated but not found in Postgres DB. Check DB seeding.`);
      // Return a minimal JWT so the user gets a meaningful error on the frontend
      // rather than a 500. Role defaults to BRANCH_USER so they land safely.
      const payload = {
        email: user.email,
        sub: 0,
        role: Role.BRANCH_USER,
        branchId: null,
        districtId: null,
        displayName: user.displayName || user.email,
      };
      return { access_token: this.jwtService.sign(payload) };
    }

    const payload = {
      email: dbUser.email,
      sub: dbUser.id,
      role: dbUser.role,
      branchId: dbUser.branch?.id ?? null,
      districtId: dbUser.district?.id ?? null,
      displayName: dbUser.displayName,
    };

    this.logger.log(`Login success: ${dbUser.email} [${dbUser.role}]`);
    return { access_token: this.jwtService.sign(payload) };
  }
}
