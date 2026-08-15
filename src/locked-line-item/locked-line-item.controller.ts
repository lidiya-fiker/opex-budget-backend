import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { LockedLineItemService } from './locked-line-item.service';
import { LockedLineItem } from '../entities/locked-line-item.entity';

@Controller('locked-line-items')
export class LockedLineItemController {
  constructor(private readonly service: LockedLineItemService) {}

  // GET /locked-line-items  — list all locked items
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // POST /locked-line-items  — lock a line item (BCC/Admin)
  @Post()
  lock(@Body() body: Partial<LockedLineItem>) {
    return this.service.lock(body);
  }

  // PATCH /locked-line-items/:id/unlock  — unlock a line item
  @Patch(':id/unlock')
  unlock(@Param('id') id: number) {
    return this.service.unlock(Number(id));
  }

  // GET /locked-line-items/:code/check  — check if a specific code is locked
  @Get(':code/check')
  isLocked(@Param('code') code: string) {
    return this.service.isLocked(code);
  }
}
