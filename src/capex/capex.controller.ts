import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { CapexService } from './capex.service';
import { CapexBusinessCase } from '../entities/capex-business-case.entity';

@Controller('capex')
export class CapexController {
  constructor(private readonly service: CapexService) {}

  // GET /capex/criteria — returns list of 18 evaluation criteria
  @Get('criteria')
  getCriteria() {
    return this.service.getCriteria();
  }

  @Get('business-cases')
  findAll() {
    return this.service.findAll();
  }

  @Get('business-cases/:id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post('business-cases')
  create(@Body() body: Partial<CapexBusinessCase>) {
    return this.service.create(body);
  }

  // PATCH /capex/business-cases/:id/score — BCC admin submits criterion scores
  @Patch('business-cases/:id/score')
  score(
    @Param('id') id: number,
    @Body() evaluation: Record<string, number>,
  ) {
    return this.service.score(id, evaluation);
  }
}
