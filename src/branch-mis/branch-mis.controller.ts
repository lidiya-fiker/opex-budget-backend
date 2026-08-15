import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { BranchMisService } from './branch-mis.service';
import { BranchMisMapping } from '../entities/branch-mis-mapping.entity';

@Controller('branch-mis')
export class BranchMisController {
  constructor(private readonly service: BranchMisService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('active')
  findActive() {
    return this.service.findActive();
  }

  @Get('closed')
  findClosed() {
    return this.service.findClosed();
  }

  // POST /branch-mis  — upsert a unit mapping
  @Post()
  upsert(@Body() body: Partial<BranchMisMapping>) {
    return this.service.upsert(body);
  }

  // PATCH /branch-mis/:code/close  — flag unit as closed
  @Patch(':code/close')
  close(@Param('code') code: string) {
    return this.service.closeUnit(code);
  }
}
