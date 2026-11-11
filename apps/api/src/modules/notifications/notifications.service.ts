import { Injectable, Optional, Logger } from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { NotificationDto, UserSession } from '@bhumitra/types';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async getNotifications(user: UserSession): Promise<NotificationDto[]> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const notifs = await this.prisma.notification.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
        });

        if (notifs.length > 0) {
          return notifs.map((n) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            // Map Prisma notification type/priority to NotificationDto union literals
            type: (n.type === 'SLA_ALERT' ? 'SLA_BREACH'
              : n.type === 'COMPLIANCE' ? 'STATUS_UPDATE'
              : n.type === 'APPROVAL_REQUIRED' ? 'ACTION_REQUIRED'
              : (n.type as NotificationDto['type'])) || 'SYSTEM',
            priority: ((n.priority || '').toLowerCase() as NotificationDto['priority']) || 'medium',
            linkUrl: n.linkUrl || undefined,
            isRead: n.isRead,
            createdAt: n.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        this.logger.warn(`Prisma getNotifications failed: ${(err as Error).message}`);
      }
    }

    return this.dataStore.getNotificationsForUser(user.id);
  }

  async getUnreadCount(user: UserSession): Promise<number> {
    const list = await this.getNotifications(user);
    return list.filter((n) => !n.isRead).length;
  }

  async markAsRead(id: string, user: UserSession): Promise<{ success: boolean }> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.notification.updateMany({
          where: { id, userId: user.id },
          data: { isRead: true },
        });
      } catch (err) {
        this.logger.warn(`Failed to mark read in DB: ${(err as Error).message}`);
      }
    }

    this.dataStore.markNotificationRead(id, user.id);
    return { success: true };
  }

  async markAllAsRead(user: UserSession): Promise<{ success: boolean; count: number }> {
    let count = 0;
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const res = await this.prisma.notification.updateMany({
          where: { userId: user.id, isRead: false },
          data: { isRead: true },
        });
        count = res.count;
      } catch (err) {
        this.logger.warn(`Failed to mark all read in DB: ${(err as Error).message}`);
      }
    }

    const memCount = this.dataStore.markAllNotificationsRead(user.id);
    return { success: true, count: count || memCount };
  }

  /**
   * Creates a notification. Uses NotificationDto-compatible type/priority literals.
   * Maps internal service enum names to the canonical NotificationDto union.
   */
  async createNotification(
    _userId: string,
    title: string,
    message: string,
    type: NotificationDto['type'],
    priority: NotificationDto['priority'],
  ): Promise<NotificationDto> {
    const notif: NotificationDto = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      priority,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.notification.create({
          data: {
            id: notif.id,
            userId: _userId,
            title,
            message,
            // Store the canonical type; Prisma schema uses its own enum
            type: type === 'SLA_BREACH' ? 'SLA_ALERT' : type,
            priority: priority.toUpperCase(),
            isRead: false,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to insert notification in DB: ${(err as Error).message}`);
      }
    }

    return notif;
  }
}
