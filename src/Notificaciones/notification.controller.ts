import { Controller, Post, Body } from '@nestjs/common';
import * as webpush from 'web-push';

@Controller('notifications')
export class NotificationsController {
  private readonly VAPID_KEYS = {
    publicKey: 'BFPLtdosCNKQUZOc1bmEJFWdwikcUhovdCEx4FgNdJbbOohGoOkGlGsHWAWNp9sTNGiUy42ICsOd_x0Jksclp9M',
    privateKey: 'qr6XhIDr_ITFiFc8YB9LuoE2jh7_ociWcejXE3c28xI',
  };

  private subscriptions: any[] = [];

  constructor() {
    webpush.setVapidDetails(
      'mailto:kireluriel@gmail.com',
      this.VAPID_KEYS.publicKey,
      this.VAPID_KEYS.privateKey,
    );
  }

  @Post('subscribe')
  subscribe(@Body() subscription: any) {
    this.subscriptions.push(subscription);
    console.log('Nueva suscripción:', subscription);
    return { message: 'Suscripción registrada.' };
  }

  sendNotification(notificationPayload: any) {
    this.subscriptions.forEach(subscription => {
      webpush.sendNotification(subscription, JSON.stringify(notificationPayload)).catch(err => {
        console.error('Error enviando notificación:', err);
      });
    });
  }
}
