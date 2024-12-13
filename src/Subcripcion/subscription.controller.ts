import { 
    Controller, 
    Post, 
    Body, 
    Get, 
    Param, 
    Patch, 
    HttpException, 
    HttpStatus 
  } from '@nestjs/common';
  import { SubscriptionService } from './subscription.service';
  
  @Controller('subscriptions')
  export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}
  
    /**
     * Guardar una nueva suscripción
     * @param body - Datos de la suscripción (endpoint y claves)
     * @returns Mensaje y la suscripción creada
     */
    @Post()
    async createSubscription(@Body() body: { endpoint: string; keys: object }) {
      try {
        const { endpoint, keys } = body;
        const newSubscription = await this.subscriptionService.saveSubscription(endpoint, keys);
        return {
          message: 'Suscripción creada exitosamente',
          subscription: newSubscription,
        };
      } catch (error) {
        throw new HttpException(
          {
            message: 'Error al crear la suscripción',
            error: error || 'Error desconocido',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    /**
     * Obtener todas las suscripciones activas
     * @returns Lista de suscripciones activas
     */
    @Get()
    async getSubscriptions() {
      try {
        const subscriptions = await this.subscriptionService.getSubscriptions();
        return {
          message: 'Suscripciones activas obtenidas correctamente',
          subscriptions,
        };
      } catch (error) {
        throw new HttpException(
          {
            message: 'Error al obtener las suscripciones',
            error: error || 'Error desconocido',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    /**
     * Desactivar una suscripción por ID
     * @param id - ID de la suscripción a desactivar
     */
    @Patch(':id/deactivate')
    async deactivateSubscription(@Param('id') id: number) {
      try {
        await this.subscriptionService.deactivateSubscription(id);
        return { message: `Suscripción con ID ${id} desactivada exitosamente` };
      } catch (error) {
        throw new HttpException(
          {
            message: 'Error al desactivar la suscripción',
            error: error || 'Error desconocido',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }
  