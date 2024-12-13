import * as webPush from 'web-push';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
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

  // Configura las claves VAPID
  private readonly vapidKeys = {
    publicKey:
      'BFPLtdosCNKQUZOc1bmEJFWdwikcUhovdCEx4FgNdJbbOohGoOkGlGsHWAWNp9sTNGiUy42ICsOd_x0Jksclp9M',
    privateKey: 'qr6XhIDr_ITFiFc8YB9LuoE2jh7_ociWcejXE3c28xI',
  };

  /**
   * Guardar una nueva suscripción
   * @param endpoint - Endpoint del cliente
   * @param keys - Claves asociadas a la suscripción (p256dh, auth, etc.)
   * @returns La suscripción creada
   */
  async saveSubscription(endpoint: string, keys: object): Promise<Subscription> {
    try {
      const existingSubscription = await this.subscriptionRepository.findOneBy({ endpoint });
      if (existingSubscription) {
        throw new Error('Ya existe una suscripción con este endpoint');
      }
  
      // Asegúrate de que isActive sea true
      const subscription = this.subscriptionRepository.create({ endpoint, keys, isActive: true });
      return await this.subscriptionRepository.save(subscription);
    } catch (error) {
      throw new InternalServerErrorException(`Error al guardar la suscripción: ${error}`);
    }
  }
  

  /**
   * Obtener todas las suscripciones activas
   * @returns Lista de suscripciones activas
   */
  async getSubscriptions(): Promise<Subscription[]> {
  try {
    const subscriptions = await this.subscriptionRepository.find({ where: { isActive: true } });
    console.log('Suscripciones activas:', subscriptions);  // Verifica qué suscripciones se están obteniendo
    return subscriptions;
  } catch (error) {
    throw new InternalServerErrorException('Error al obtener las suscripciones');
  }
}


  /**
   * Marcar una suscripción como inactiva
   * @param id - ID de la suscripción
   */
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
      throw new InternalServerErrorException('Error al desactivar la suscripción');
    }
  }

  /**
   * Enviar notificaciones push a todas las suscripciones activas
   * @param payload - Datos de la notificación (título, cuerpo, etc.)
   */
  async sendNotification(payload: object): Promise<void> {
    try {
      const subscriptions = await this.getSubscriptions();

      if (subscriptions.length === 0) {
        console.warn('No hay suscripciones activas para enviar notificaciones.');
        return;
      }

      webPush.setVapidDetails(
        'kireluriel@gmail.com',
        this.vapidKeys.publicKey,
        this.vapidKeys.privateKey,
      );

      // Enviar la notificación a todas las suscripciones activas
      const notificationPromises = subscriptions.map((subscription) => {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        };

        return webPush
          .sendNotification(pushSubscription, JSON.stringify(payload))
          .catch((error) => {
            console.error(
              `Error al enviar la notificación a ${subscription.endpoint}:`,
              error,
            );
          });
      });

      await Promise.all(notificationPromises);
    } catch (error) {
      throw new InternalServerErrorException('Error al enviar notificaciones push');
    }
  }
}
