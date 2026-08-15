import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssociatedExpenseRule } from '../entities/associated-expense-rule.entity';
import { AssociatedExpenseService } from './associated-expense.service';
import { AssociatedExpenseController } from './associated-expense.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AssociatedExpenseRule])],
  providers: [AssociatedExpenseService],
  controllers: [AssociatedExpenseController],
  exports: [AssociatedExpenseService],
})
export class AssociatedExpenseModule {}
