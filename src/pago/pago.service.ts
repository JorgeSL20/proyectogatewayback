import { Injectable, Inject, forwardRef, NotFoundException, HttpStatus } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { CarritoService } from 'src/carrito/carrito.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class PagoService {
  private environment: paypal.core.LiveEnvironment | paypal.core.SandboxEnvironment;
  private client: paypal.core.PayPalHttpClient;

  constructor(
    @Inject(forwardRef(() => CarritoService))
    private carritoService: CarritoService,
    @InjectRepository(Pago) private pagoRepository: Repository<Pago>,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {
    const clientId = process.env.PAYPAL_LIVE_MODE === 'true'
      ? process.env.PAYPAL_CLIENT_ID_LIVE
      : process.env.PAYPAL_CLIENT_ID_SANDBOX;
    const clientSecret = process.env.PAYPAL_LIVE_MODE === 'true'
      ? process.env.PAYPAL_CLIENT_SECRET_LIVE
      : process.env.PAYPAL_CLIENT_SECRET_SANDBOX;

    this.environment = process.env.PAYPAL_LIVE_MODE === 'true'
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);

    this.client = new paypal.core.PayPalHttpClient(this.environment);
  }

  async crearOrden(pagoData: any) {
    const { total, items } = pagoData;

    try {
      const request = new paypal.orders.OrdersCreateRequest();
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'MXN',
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'MXN',
                value: total.toFixed(2),
              },
            },
          },
          items: items.map(item => ({
            name: item.productoNombre,
            unit_amount: {
              currency_code: 'MXN',
              value: item.productoPrecio.toFixed(2),
            },
            quantity: item.cantidad.toString(),
          })),
        }],
      });

      const response = await this.client.execute(request);
      return response.result;
    } catch (error) {
      console.error('Error al crear la orden de PayPal:', (error as Error).message);
      throw new Error('Error al crear la orden de PayPal');
    }
  }

  async capturarPago(orderId: string, userId: number) {
    try {
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});
      
      const response = await this.client.execute(request);
  
      const usuario = await this.authRepository.findOne({ where: { id: userId } });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }
  
      const pago = this.pagoRepository.create({
        usuario,
        total: parseFloat(response.result.purchase_units[0].amount.value),
        items: response.result.purchase_units[0].items,
      });
  
      await this.pagoRepository.save(pago);
      await this.carritoService.limpiarCarrito(userId);
  
      return {
        message: 'Pago capturado y guardado exitosamente',
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Error al capturar el pago de PayPal:', error);
      throw new Error(`Error al capturar el pago de PayPal: ${(error as Error).message}`);
    }
  }  
}
