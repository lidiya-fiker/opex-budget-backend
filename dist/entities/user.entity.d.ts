import { Branch } from './branch.entity';
import { District } from './district.entity';
import { Department } from './department.entity';
export declare enum Role {
    BRANCH_USER = "BRANCH_USER",
    BRANCH_MANAGER = "BRANCH_MANAGER",
    DISTRICT_MANAGER = "DISTRICT_MANAGER",
    DEPARTMENT_USER = "DEPARTMENT_USER",
    BCC_TEAM = "BCC_TEAM",
    STRATEGY_OFFICER = "STRATEGY_OFFICER",
    EXECUTIVE = "EXECUTIVE",
    BOARD = "BOARD",
    ADMIN = "ADMIN",
    INTERNAL_AUDIT = "INTERNAL_AUDIT"
}
export declare class User {
    id: number;
    email: string;
    displayName: string;
    passwordHash: string;
    role: Role;
    branch: Branch | null;
    district: District | null;
    department: Department | null;
}
