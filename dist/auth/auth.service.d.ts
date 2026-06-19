import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { SeedService } from '../seed/seed.service';
export declare class AuthService {
    private jwtService;
    private userRepository;
    private seedService;
    private readonly logger;
    constructor(jwtService: JwtService, userRepository: Repository<User>, seedService: SeedService);
    validateUserLocal(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
