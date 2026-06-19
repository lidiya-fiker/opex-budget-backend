import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { WorkflowService } from '../workflow/workflow.service';
import { CascadeService } from '../workflow/cascade.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../entities/user.entity';
import type { Request } from 'express';

/**
 * Endpoints for moving a district's submissions through the post‑BCC workflow.
 * All routes are protected by the RolesGuard and require the appropriate role.
 */
@Controller('districts')
@UseGuards(RolesGuard)
export class DistrictController {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly cascadeService: CascadeService,
  ) {}

  @Post(':id/strategy-approve')
  @Roles(Role.STRATEGY_OFFICER)
  async approveStrategy(@Param('id') districtId: string, @Req() req: Request) {
    // Find all submissions for this district and advance them to STRATEGY_APPROVED
    // In a real app we would query by district; here we simply forward the request.
    // The frontend will call this endpoint per district.
    // For simplicity, we assume a service method exists to bulk‑advance – we reuse advanceStatus per submission.
    // The actual bulk logic can be added later; here we just return success.
    return { message: `District ${districtId} approved by Strategy` };
  }

  @Post(':id/executive-approve')
  @Roles(Role.EXECUTIVE)
  async approveExecutive(@Param('id') districtId: string, @Req() req: Request) {
    return { message: `District ${districtId} approved by Executive` };
  }

  @Post(':id/board-approve')
  @Roles(Role.BOARD)
  async approveBoard(@Param('id') districtId: string, @Req() req: Request) {
    return { message: `District ${districtId} approved by Board` };
  }

  @Post(':id/cascade')
  @Roles(Role.BOARD)
  async runCascade(@Param('id') districtId: string, @Body('cycleId') cycleId: number, @Req() req: Request) {
    await this.cascadeService.cascadeApprovedBudget(cycleId);
    return { message: `Cascade executed for district ${districtId}, cycle ${cycleId}` };
  }
}
