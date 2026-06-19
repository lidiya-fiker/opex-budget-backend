import { User } from './user.entity';
export declare class Notification {
    id: number;
    user: User;
    message: string;
    isRead: boolean;
    actionLink: string;
    createdAt: Date;
}
