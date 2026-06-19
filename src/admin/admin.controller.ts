import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { District } from '../entities/district.entity';
import { Branch } from '../entities/branch.entity';
import { User, Role } from '../entities/user.entity';
import { Department } from '../entities/department.entity';

@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(District) private districtRepo: Repository<District>,
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Department) private departmentRepo: Repository<Department>,
  ) {}

  // ===== DEPARTMENTS =====
  @Get('departments')
  async getDepartments() {
    return this.departmentRepo.find();
  }

  // ===== DISTRICTS =====

  @Get('districts')
  async getDistricts() {
    return this.districtRepo.find({ relations: ['branches'] });
  }

  @Post('districts')
  async createDistrict(@Body() body: { name: string; code: string }) {
    const district = this.districtRepo.create(body);
    return this.districtRepo.save(district);
  }

  @Put('districts/:id')
  async updateDistrict(@Param('id') id: number, @Body() body: { name?: string; code?: string }) {
    await this.districtRepo.update(id, body);
    return this.districtRepo.findOne({ where: { id }, relations: ['branches'] });
  }

  @Delete('districts/:id')
  async deleteDistrict(@Param('id') id: number) {
    await this.districtRepo.delete(id);
    return { deleted: true };
  }

  // ===== BRANCHES =====

  @Get('branches')
  async getBranches() {
    return this.branchRepo.find({ relations: ['district'] });
  }

  @Post('branches')
  async createBranch(@Body() body: { name: string; code: string; districtId: number }) {
    const district = await this.districtRepo.findOne({ where: { id: body.districtId } });
    if (!district) throw new HttpException('District not found', HttpStatus.NOT_FOUND);
    const branch = this.branchRepo.create({ name: body.name, code: body.code, district });
    return this.branchRepo.save(branch);
  }

  @Put('branches/:id')
  async updateBranch(@Param('id') id: number, @Body() body: { name?: string; code?: string; districtId?: number }) {
    const branch = await this.branchRepo.findOne({ where: { id }, relations: ['district'] });
    if (!branch) throw new HttpException('Branch not found', HttpStatus.NOT_FOUND);
    if (body.districtId) {
      const district = await this.districtRepo.findOne({ where: { id: body.districtId } });
      if (district) branch.district = district;
    }
    if (body.name) branch.name = body.name;
    if (body.code) branch.code = body.code;
    return this.branchRepo.save(branch);
  }

  @Delete('branches/:id')
  async deleteBranch(@Param('id') id: number) {
    await this.branchRepo.delete(id);
    return { deleted: true };
  }

  // ===== USERS =====

  @Get('users')
  async getUsers() {
    const users = await this.userRepo.find({ relations: ['branch', 'district'] });
    return users.map(u => ({ ...u, passwordHash: undefined }));
  }

  @Post('users')
  async createUser(@Body() body: {
    email: string;
    displayName: string;
    password: string;
    role: Role;
    branchId?: number;
    districtId?: number;
  }) {
    const existing = await this.userRepo.findOne({ where: { email: body.email } });
    if (existing) throw new HttpException('Email already exists', HttpStatus.CONFLICT);

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = this.userRepo.create({
      email: body.email,
      displayName: body.displayName,
      passwordHash,
      role: body.role,
    });

    if (body.branchId) {
      const branch = await this.branchRepo.findOne({ where: { id: body.branchId } });
      if (branch) user.branch = branch;
    }
    if (body.districtId) {
      const district = await this.districtRepo.findOne({ where: { id: body.districtId } });
      if (district) user.district = district;
    }

    const saved = await this.userRepo.save(user);
    return { ...saved, passwordHash: undefined };
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: number, @Body() body: {
    email?: string;
    displayName?: string;
    password?: string;
    role?: Role;
    branchId?: number;
    districtId?: number;
  }) {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['branch', 'district'] });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (body.email) user.email = body.email;
    if (body.displayName) user.displayName = body.displayName;
    if (body.role) user.role = body.role;
    if (body.password) user.passwordHash = await bcrypt.hash(body.password, 10);
    if (body.branchId) {
      const branch = await this.branchRepo.findOne({ where: { id: body.branchId } });
      if (branch) user.branch = branch;
    }
    if (body.districtId) {
      const district = await this.districtRepo.findOne({ where: { id: body.districtId } });
      if (district) user.district = district;
    }

    const saved = await this.userRepo.save(user);
    return { ...saved, passwordHash: undefined };
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number) {
    await this.userRepo.delete(id);
    return { deleted: true };
  }

  // ===== ROLES LIST =====

  @Get('roles')
  getRoles() {
    return Object.values(Role);
  }
}
