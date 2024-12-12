import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  // Guardar una nueva suscripción
  async saveSubscription(endpoint: string, keys: object): Promise<Subscription> {
    const subscription = this.subscriptionRepository.create({ endpoint, keys });
    return this.subscriptionRepository.save(subscription);
  }

  // Obtener todas las suscripciones
  async getSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionRepository.find();
  }

  // Marcar una suscripción como inactiva
  async deactivateSubscription(id: number): Promise<void> {
    await this.subscriptionRepository.update(id, { isActive: false });
  }
}
