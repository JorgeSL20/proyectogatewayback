import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async subscriptions(@Body() body: { endpoint: string; keys: object }) {
    try {
      // Guardar la suscripción en la base de datos
      const { endpoint, keys } = body;
      const newSubscription = await this.subscriptionService.saveSubscription(endpoint, keys);
      return { message: 'Suscripción exitosa', subscription: newSubscription };
    } catch (error) {
      return { message: 'Error al suscribirse', error: error};
    }
  }
}
