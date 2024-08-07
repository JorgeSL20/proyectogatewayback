import { Injectable, Inject, forwardRef, NotFoundException, HttpStatus, BadRequestException } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { CarritoService } from 'src/carrito/carrito.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Injectable()
export class PagoService {
  private environment: paypal.core.LiveEnvironment;
  private client: paypal.core.PayPalHttpClient;

  constructor(
    @Inject(forwardRef(() => CarritoService))
    private carritoService: CarritoService,
    @InjectRepository(Pago) private pagoRepository: Repository<Pago>,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    @InjectRepository(Producto) private productoRepository: Repository<Producto>,
  ) {
    const clientId = process.env.PAYPAL_CLIENT_ID_LIVE;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET_LIVE;

    this.environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
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
      // Verificar el estado de la orden
      const orderRequest = new paypal.orders.OrdersGetRequest(orderId);
      const orderResponse = await this.client.execute(orderRequest);
      
      if (orderResponse.result.status === 'COMPLETED') {
        return {
          message: 'La orden ya ha sido capturada previamente.',
          status: HttpStatus.CONFLICT,
        };
      }

      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});
      
      const response = await this.client.execute(request);

      if (response.result.status === 'COMPLETED') {
        return {
          message: 'La orden ya ha sido capturada previamente.',
          status: HttpStatus.CONFLICT,
        };
      }

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

      // Limpiar el carrito del usuario
      await this.carritoService.limpiarCarrito(userId);

      // Actualizar existencias de productos
      const items = response.result.purchase_units[0].items;
      for (const item of items) {
        const producto = await this.productoRepository.findOne({ where: { producto: item.name } }); // Busca por 'producto' en lugar de 'nombre'
        if (producto) {
          producto.existencias -= parseInt(item.quantity, 10);
          if (producto.existencias < 0) {
            throw new BadRequestException(`No hay suficientes existencias para el producto con nombre ${producto.producto}`);
          }
          await this.productoRepository.save(producto);
        } else {
          throw new NotFoundException(`Producto con nombre ${item.name} no encontrado`);
        }
      }
  
      return {
        message: 'Pago capturado y guardado exitosamente',
        status: HttpStatus.OK,
      };
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'details' in error && (error as any).details[0].issue === 'ORDER_ALREADY_CAPTURED') {
        return {
          message: 'La orden ya ha sido capturada previamente.',
          status: HttpStatus.CONFLICT,
        };
      }

      console.error('Error al capturar el pago de PayPal:', (error as Error).message);
      throw new Error(`Error al capturar el pago de PayPal: ${(error as Error).message}`);
    }
  }
}
