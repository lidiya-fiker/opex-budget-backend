import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('DB_HOST') || 'localhost',
  port: parseInt(config.get<string>('DB_PORT') || '5432', 10),
  username: config.get<string>('DB_USER') || 'budget_user',
  password: config.get<string>('DB_PASS') || 'budget_password',
  database: config.get<string>('DB_NAME') || 'budget_db',
  autoLoadEntities: true,
  synchronize: true, // Set to false in production!
});
