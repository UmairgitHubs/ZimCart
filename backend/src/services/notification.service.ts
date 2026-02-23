import { Expo, type ExpoPushMessage } from 'expo-server-sdk';
import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { sendGeneralNotificationEmail } from './email.service.js';
import { sendSMS } from './sms.service.js';

// Create a singleton instance of the Expo SDK
let expo = new Expo();

export class NotificationService {
  /**
   * Send a multi-channel notification to specific users
   * @param userIds Array of user IDs to receive the notification
   * @param title Notification title
   * @param body Notification body
   * @param data Optional data payload (e.g. { type: 'order', url: '...' })
   */
  async sendNotification(
    userIds: string[],
    title: string,
    body: string,
    data: any = {}
  ) {
    // 1. Fetch users and their preferences
    const type = data?.type?.toLowerCase();
    const granularPref: any = {};
    if (type === 'order') granularPref.orderUpdatesEnabled = true;
    else if (type === 'delivery') granularPref.deliveryUpdatesEnabled = true;
    else if (type === 'promo') granularPref.promotionalEnabled = true;
    else if (type === 'new_arrival') granularPref.newArrivalsEnabled = true;

    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      include: {
        notifications: true
      }
    });

    if (users.length === 0) return;

    // 2. Filter users per channel based on preferences
    const pushUsers = users.filter(u => 
        u.pushToken && 
        u.notifications?.pushEnabled !== false &&
        (!granularPref.orderUpdatesEnabled || u.notifications?.orderUpdatesEnabled !== false) &&
        (!granularPref.deliveryUpdatesEnabled || u.notifications?.deliveryUpdatesEnabled !== false) &&
        (!granularPref.promotionalEnabled || u.notifications?.promotionalEnabled !== false) &&
        (!granularPref.newArrivalsEnabled || u.notifications?.newArrivalsEnabled !== false)
    );

    const emailUsers = users.filter(u => u.notifications?.emailEnabled === true);
    const smsUsers = users.filter(u => u.notifications?.smsEnabled === true && u.phone);

    // 3. Dispatch Push Notifications
    if (pushUsers.length > 0) {
        this.dispatchPush(pushUsers, title, body, data);
    }

    // 4. Dispatch Email Notifications
    if (emailUsers.length > 0) {
        emailUsers.forEach(user => {
            sendGeneralNotificationEmail(user.email, title, body, data.url)
                .catch(err => console.error(`Failed to send email to ${user.email}:`, err));
        });
    }

    // 5. Dispatch SMS Notifications
    if (smsUsers.length > 0) {
        smsUsers.forEach(user => {
            sendSMS(user.phone!, `${title}: ${body}`)
                .catch(err => console.error(`Failed to send SMS to ${user.phone}:`, err));
        });
    }

    // 6. Keep a persistent history in the database for the Inbox
    try {
        await prisma.notification.createMany({
            data: users.map(user => ({
                userId: user.id,
                title,
                body,
                type: data?.type?.toLowerCase() || 'system',
                data: data || {},
            }))
        });
    } catch (dbError) {
        console.error('Failed to log notifications to database:', dbError);
    }
  }

  /**
   * Internal helper to dispatch Push via Expo
   */
  private async dispatchPush(users: any[], title: string, body: string, data: any) {
    const messages: ExpoPushMessage[] = [];
    
    for (const user of users) {
      if (!user.pushToken || !Expo.isExpoPushToken(user.pushToken)) continue;

      messages.push({
        to: user.pushToken,
        sound: user.notifications?.soundEnabled !== false ? 'default' : null,
        title,
        body,
        data: { ...data, userId: user.id },
        priority: 'high',
      });
    }

    let chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error('Error sending push chunk:', error);
      }
    }
  }

  /**
   * Legacy method for backward compatibility
   */
  async sendPushNotification(userIds: string[], title: string, body: string, data: any = {}) {
      return this.sendNotification(userIds, title, body, data);
  }

  /**
   * Save or update a push token for a user
   */
  async updatePushToken(userId: string, pushToken: string) {
    if (!Expo.isExpoPushToken(pushToken)) {
        throw new ApiError(400, 'Invalid Expo Push Token');
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { pushToken: true, name: true }
    });

    const isNewToken = user?.pushToken !== pushToken;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { pushToken },
        select: { id: true, pushToken: true }
    });

    if (isNewToken) {
        setTimeout(() => {
            this.sendNotification(
                [userId],
                `Welcome to ZimCart, ${user?.name || 'Customer'}! 🚀`,
                "Notifications are now active. You'll get real-time updates for your orders.",
                { type: 'WELCOME_ONBOARDING' }
            ).catch(err => console.error("Failed to send welcome notification:", err));
        }, 3000);
    }

    return updatedUser;
  }

  /**
   * Broadcast notification to all users
   */
  async broadcast(title: string, body: string, data: any = {}) {
    const users = await prisma.user.findMany({
        where: { pushToken: { not: null } },
        select: { id: true }
    });

    const userIds = users.map(u => u.id);
    if (userIds.length === 0) return;

    return this.sendNotification(userIds, title, body, data);
  }
}

export const notificationService = new NotificationService();
