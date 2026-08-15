import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ContractRegisterService } from './contract-register.service';
import { ContractRegister } from '../entities/contract-register.entity';

@Controller('contract-register')
export class ContractRegisterController {
  constructor(private readonly service: ContractRegisterService) {}

  @Post()
  create(@Body() body: Partial<ContractRegister>) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('active')
  findActive() {
    return this.service.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: Partial<ContractRegister>) {
    return this.service.update(id, body);
  }

  @Post('expire')
  markExpired() {
    return this.service.markExpired();
  }
}
