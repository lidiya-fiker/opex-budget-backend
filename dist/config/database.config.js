"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const databaseConfig = (config) => ({
    type: 'postgres',
    host: config.get('DB_HOST') || 'localhost',
    port: parseInt(config.get('DB_PORT') || '5432', 10),
    username: config.get('DB_USER') || 'budget_user',
    password: config.get('DB_PASS') || 'budget_password',
    database: config.get('DB_NAME') || 'budget_db',
    autoLoadEntities: true,
    synchronize: true,
});
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map