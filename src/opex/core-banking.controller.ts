import { Controller, Get, Post, Param, Body, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreBankingService } from './core-banking.service';
import { CoreBankingTransaction, CoreBankingLog } from '../entities/core-banking.entity';
import { Role } from '../entities/user.entity';

@Controller('core-banking')
@UseGuards(AuthGuard('jwt'))
export class CoreBankingController {
  constructor(
    private readonly cbService: CoreBankingService,
    @InjectRepository(CoreBankingTransaction)
    private readonly transactionRepo: Repository<CoreBankingTransaction>,
    @InjectRepository(CoreBankingLog)
    private readonly logRepo: Repository<CoreBankingLog>,
  ) {}

  @Post('refresh')
  async refresh(@Request() req: any) {
    if (req.user.role !== Role.BCC_TEAM && req.user.role !== Role.ADMIN) {
      throw new HttpException('Only BCC staff can refresh core banking data', HttpStatus.FORBIDDEN);
    }
    return this.cbService.syncTransactions();
  }

  @Get('logs')
  async getLogs() {
    return this.logRepo.find({ order: { id: 'DESC' }, take: 20 });
  }

  @Get('unmapped')
  async getUnmapped() {
    return this.transactionRepo.find({
      where: { isMapped: false },
      order: { id: 'DESC' },
    });
  }

  @Post('map/:id')
  async manualMap(
    @Param('id') id: number,
    @Body() body: { budgetId: number },
    @Request() req: any,
  ) {
    if (req.user.role !== Role.BCC_TEAM && req.user.role !== Role.ADMIN) {
      throw new HttpException('Only BCC staff can manually map transactions', HttpStatus.FORBIDDEN);
    }
    return this.cbService.manualMap(id, body.budgetId);
  }

  @Post('simulate')
  async simulate(@Body() body: { count?: number; fiscalYear?: string }, @Request() req: any) {
    const count = body.count || 5;
    const txs = await this.cbService.generateMockTransactions(count, body.fiscalYear);
    // Auto-refresh after simulating, for instant feedback
    await this.cbService.syncTransactions();
    return txs;
  }
}
