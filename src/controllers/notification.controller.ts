import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  // GET /notifications — returns all notifications for the logged-in user (unread first)
  @Get()
  async getNotifications(@Request() req) {
    const userId = req.user.id;
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { isRead: 'ASC', createdAt: 'DESC' },
    });
  }

  // PATCH /notifications/:id/read — marks a specific notification as read (dismiss)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: number, @Request() req) {
    const userId = req.user.id;
    const notification = await this.notificationRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (notification) {
      notification.isRead = true;
      await this.notificationRepo.save(notification);
    }
    return { success: true };
  }

  // PATCH /notifications/read-all — marks all of the user's notifications as read
  @Patch('read-all')
  async markAllAsRead(@Request() req) {
    const userId = req.user.id;
    await this.notificationRepo.update(
      { user: { id: userId }, isRead: false },
      { isRead: true }
    );
    return { success: true };
  }
}
