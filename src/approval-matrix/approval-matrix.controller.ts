import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ApprovalMatrixService } from './approval-matrix.service';
import { ApprovalMatrix } from '../entities/approval-matrix.entity';

@Controller('approval-matrix')
export class ApprovalMatrixController {
  constructor(private readonly service: ApprovalMatrixService) {}

  // GET /approval-matrix  — list all rules
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // GET /approval-matrix/chain?type=budget_transfer  — ordered approver chain for a type
  @Get('chain')
  getChain(@Query('type') type: string) {
    return this.service.getApprovalChain(type);
  }

  // GET /approval-matrix/by-type?type=supplementary_budget
  @Get('by-type')
  findByType(@Query('type') type: string) {
    return this.service.findByType(type);
  }

  // POST /approval-matrix  — add a new approval level (Admin)
  @Post()
  create(@Body() body: Partial<ApprovalMatrix>) {
    return this.service.create(body);
  }

  // PATCH /approval-matrix/:id  — update an approval level
  @Patch(':id')
  update(@Param('id') id: number, @Body() body: Partial<ApprovalMatrix>) {
    return this.service.update(Number(id), body);
  }

  // DELETE /approval-matrix/:id  — remove an approval level
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(Number(id));
  }
}
