import { Injectable, Inject, forwardRef, NotFoundException, HttpStatus } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { CarritoService } from 'src/carrito/carrito.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { CreatePagoDto } from './dto/crear-pago.dto';

@Injectable()
export class PagoService {
  private environment: paypal.core.LiveEnvironment | paypal.core.SandboxEnvironment;
  private client: paypal.core.PayPalHttpClient;

  constructor(
    @Inject(forwardRef(() => CarritoService))
    private carritoService: CarritoService,
    @InjectRepository(Pago)
    @InjectRepository(Pago) private pagoRepository: Repository<Pago>,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    this.environment = process.env.PAYPAL_LIVE_MODE === 'true'
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);

    this.client = new paypal.core.PayPalHttpClient(this.environment);
  }

  async procesarPago(pagoData: any, userId: number) {
    const { total, items } = pagoData;

    // Crear orden en PayPal
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
  }

  async capturarPago(orderId: string, userId: number) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await this.client.execute(request);

    // Guardar la transacción en la base de datos
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

    // Limpiar el carrito del usuario después del pago
    await this.carritoService.limpiarCarrito(userId);

    return {
      message: 'Pago capturado y guardado exitosamente',
      status: HttpStatus.OK,
    };
  }
}
