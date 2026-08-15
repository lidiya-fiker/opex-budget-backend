import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AssociatedExpenseService } from './associated-expense.service';
import { AssociatedExpenseRule } from '../entities/associated-expense-rule.entity';

@Controller('associated-expenses')
export class AssociatedExpenseController {
  constructor(private readonly service: AssociatedExpenseService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body: Partial<AssociatedExpenseRule>) {
    return this.service.create(body);
  }

  // GET /associated-expenses/calculate?accountCode=BASIC_SALARY&amount=100000
  @Get('calculate')
  calculate(
    @Query('accountCode') accountCode: string,
    @Query('amount') amount: number,
  ) {
    return this.service.calculate(accountCode, Number(amount));
  }
}
