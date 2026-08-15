import { Controller, Post, Patch, Get, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ManualPaymentService } from './manual-payment.service';
import { CreateManualPaymentDto } from '../dto/create-manual-payment.dto';
import { Role } from '../entities/user.entity';

@Controller('manual-payments')
@UseGuards(AuthGuard('jwt'))
export class ManualPaymentController {
  constructor(private readonly service: ManualPaymentService) {}

  // POST /manual-payments  — Payment & Settlement / FIRD create request
  @Post()
  create(@Body() dto: CreateManualPaymentDto, @Request() req) {
    const requesterId = req.user ? req.user.id : dto.requesterId;
    return this.service.create(dto, requesterId);
  }

  // GET /manual-payments — Returns all manual payments with role-based visibility
  @Get()
  async findAll(@Request() req) {
    const payments = await this.service.findAll();
    const role = req.user?.role;

    // Roles with FULL visibility of amounts:
    //   BCC_TEAM, BUDGET_OWNER, ADMIN, CHIEF_OFFICER, EXECUTIVE, BOARD
    // Roles with RESTRICTED visibility (can only see budget code, description, work unit):
    //   PAYMENT_SETTLEMENT, FIRD, DEPARTMENT_USER
    const fullVisibilityRoles: Role[] = [
      Role.BCC_TEAM,
      Role.BUDGET_OWNER,
      Role.ADMIN,
      Role.CHIEF_OFFICER,
      Role.EXECUTIVE,
      Role.BOARD,
    ];

    return payments.map(payment => {
      const isOwner = payment.requesterId === req.user?.id;
      if (fullVisibilityRoles.includes(role) || isOwner) {
        return payment;
      }

      // PAYMENT_SETTLEMENT, FIRD, DEPARTMENT_USER — restricted: scrub amount
      const { amount, ...scrubbed } = payment;
      return {
        ...scrubbed,
        amount: null,
        _visibility: 'RESTRICTED', // client can show "Restricted" badge
      };
    });
  }

  // GET /manual-payments/dashboard/breakdown — Returns breakdown metrics for dashboard
  @Get('dashboard/breakdown')
  getDashboardBreakdown() {
    return this.service.getBreakdown();
  }

  // PATCH /manual-payments/:id/approve  — BCC approves & triggers email with token link
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(Number(id));
  }

  // GET /manual-payments/confirm?token=  — requester clicks link, CBS payment triggered
  @Get('confirm')
  confirm(@Query('token') token: string) {
    return this.service.confirm(token);
  }
}
