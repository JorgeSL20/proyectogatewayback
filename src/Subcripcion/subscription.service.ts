import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

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

      const subscription = this.subscriptionRepository.create({ endpoint, keys });
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
      return await this.subscriptionRepository.find({ where: { isActive: true } });
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
}
