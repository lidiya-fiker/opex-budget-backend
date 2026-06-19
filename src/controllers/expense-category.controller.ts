import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseCategory } from '../entities/expense-category.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('expense-categories')
@UseGuards(AuthGuard('jwt'))
export class ExpenseCategoryController {
  constructor(
    @InjectRepository(ExpenseCategory)
    private readonly categoryRepo: Repository<ExpenseCategory>,
  ) {}

  @Get()
  async findAll() {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  @Post()
  async createOrUpdate(@Body() data: any) {
    // Save or update category
    if (data.id) {
      await this.categoryRepo.update(data.id, {
        name: data.name,
        description: data.description,
        code: data.code,
        group: data.group,
        isMandatory: data.isMandatory
      });
      return this.categoryRepo.findOne({ where: { id: data.id } });
    }
    const { id, ...cleanData } = data;
    const category = this.categoryRepo.create(cleanData);
    return this.categoryRepo.save(category);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.categoryRepo.delete(id);
    return { success: true };
  }
}
