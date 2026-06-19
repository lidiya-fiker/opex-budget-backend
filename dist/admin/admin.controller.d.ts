import { Repository } from 'typeorm';
import { District } from '../entities/district.entity';
import { Branch } from '../entities/branch.entity';
import { User, Role } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
export declare class AdminController {
    private districtRepo;
    private branchRepo;
    private userRepo;
    private departmentRepo;
    constructor(districtRepo: Repository<District>, branchRepo: Repository<Branch>, userRepo: Repository<User>, departmentRepo: Repository<Department>);
    getDepartments(): Promise<Department[]>;
    getDistricts(): Promise<District[]>;
    createDistrict(body: {
        name: string;
        code: string;
    }): Promise<District>;
    updateDistrict(id: number, body: {
        name?: string;
        code?: string;
    }): Promise<District | null>;
    deleteDistrict(id: number): Promise<{
        deleted: boolean;
    }>;
    getBranches(): Promise<Branch[]>;
    createBranch(body: {
        name: string;
        code: string;
        districtId: number;
    }): Promise<Branch>;
    updateBranch(id: number, body: {
        name?: string;
        code?: string;
        districtId?: number;
    }): Promise<Branch>;
    deleteBranch(id: number): Promise<{
        deleted: boolean;
    }>;
    getUsers(): Promise<{
        passwordHash: undefined;
        id: number;
        email: string;
        displayName: string;
        role: Role;
        branch: Branch | null;
        district: District | null;
    }[]>;
    createUser(body: {
        email: string;
        displayName: string;
        password: string;
        role: Role;
        branchId?: number;
        districtId?: number;
    }): Promise<{
        passwordHash: undefined;
        id: number;
        email: string;
        displayName: string;
        role: Role;
        branch: Branch | null;
        district: District | null;
    }>;
    updateUser(id: number, body: {
        email?: string;
        displayName?: string;
        password?: string;
        role?: Role;
        branchId?: number;
        districtId?: number;
    }): Promise<{
        passwordHash: undefined;
        id: number;
        email: string;
        displayName: string;
        role: Role;
        branch: Branch | null;
        district: District | null;
    }>;
    deleteUser(id: number): Promise<{
        deleted: boolean;
    }>;
    getRoles(): Role[];
}
