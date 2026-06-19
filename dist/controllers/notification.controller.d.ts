import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
export declare class NotificationController {
    private readonly notificationRepo;
    constructor(notificationRepo: Repository<Notification>);
    getNotifications(req: any): Promise<Notification[]>;
    markAsRead(id: number, req: any): Promise<{
        success: boolean;
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
    }>;
}
