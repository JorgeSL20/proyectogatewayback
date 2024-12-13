import * as webPush from 'web-push';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  private readonly vapidKeys = {
    publicKey:
      'BFPLtdosCNKQUZOc1bmEJFWdwikcUhovdCEx4FgNdJbbOohGoOkGlGsHWAWNp9sTNGiUy42ICsOd_x0Jksclp9M',
    privateKey: 'qr6XhIDr_ITFiFc8YB9LuoE2jh7_ociWcejXE3c28xI',
  };

  async saveSubscription(endpoint: string, keys: object): Promise<Subscription> {
    try {
      const existingSubscription = await this.subscriptionRepository.findOneBy({ endpoint });
      if (existingSubscription) {
        throw new Error('Ya existe una suscripción con este endpoint');
      }

      const subscription = this.subscriptionRepository.create({ endpoint, keys, isActive: true });
      return await this.subscriptionRepository.save(subscription);
    } catch (error) {
      console.error(`Error al guardar la suscripción: ${error}`);
      throw new InternalServerErrorException(`Error al guardar la suscripción: ${error}`);
    }
  }

  async getSubscriptions(): Promise<Subscription[]> {
    try {
      const subscriptions = await this.subscriptionRepository.find({ where: { isActive: true } });
      return subscriptions;
    } catch (error) {
      console.error('Error al obtener las suscripciones:', error);
      throw new InternalServerErrorException('Error al obtener las suscripciones');
    }
  }

  async sendNotification(payload: object): Promise<void> {
    try {
      const subscriptions = await this.getSubscriptions();

      if (subscriptions.length === 0) {
        console.warn('No hay suscripciones activas para enviar notificaciones.');
        return;
      }

      webPush.setVapidDetails(
        'mailto:kireluriel@gmail.com',
        this.vapidKeys.publicKey,
        this.vapidKeys.privateKey,
      );

      const notificationPromises = subscriptions.map(async (subscription) => {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        };

        try {
          await webPush.sendNotification(pushSubscription, JSON.stringify(payload));
          console.log(`Notificación enviada a ${subscription.endpoint}`);
        } catch (error) {
          if ((error as any).statusCode === 410) {
            console.warn(`Suscripción expirada o inválida: ${subscription.endpoint}`);
            await this.deactivateSubscription(subscription.id);
          } else {
            console.error(`Error al enviar notificación a ${subscription.endpoint}:`, error);
          }
        }
      });

      await Promise.all(notificationPromises);
    } catch (error) {
      console.error('Error al enviar notificaciones push:', error);
      throw new InternalServerErrorException('Error al enviar notificaciones push');
    }
  }

  async deactivateSubscription(id: number): Promise<void> {
    try {
      const subscription = await this.subscriptionRepository.findOneBy({ id });
      if (!subscription) {
        throw new NotFoundException('Suscripción no encontrada');
      }
      subscription.isActive = false;
      await this.subscriptionRepository.save(subscription);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Error al desactivar la suscripción:', error);
      throw new InternalServerErrorException('Error al desactivar la suscripción');
    }
  }
}
