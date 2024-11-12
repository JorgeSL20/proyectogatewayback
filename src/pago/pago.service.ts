/*import { Injectable, Inject, forwardRef, NotFoundException, HttpStatus, BadRequestException } from '@nestjs/common';
import * as mercadopago from 'mercadopago';
import { CarritoService } from 'src/carrito/carrito.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Injectable()
export class PagoService {
  constructor(
    @Inject(forwardRef(() => CarritoService))
    private carritoService: CarritoService,
    @InjectRepository(Pago) private pagoRepository: Repository<Pago>,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    @InjectRepository(Producto) private productoRepository: Repository<Producto>,
  ) {
    mercadopago.configurations = { access_token: process.env.MERCADOPAGO_ACCESS_TOKEN };
  }

  async crearOrden(pagoData: any) {
    const { total, items } = pagoData;

    try {
      const preference = {
        items: items.map(item => ({
          title: item.productoNombre,
          unit_price: item.productoPrecio,
          quantity: item.cantidad,
          currency_id: 'MXN',
        })),
        payer: {
          email: pagoData.email,
        },
        back_urls: {
          success: 'https://your-success-url.com',
          failure: 'https://your-failure-url.com',
          pending: 'https://your-pending-url.com',
        },
        auto_return: 'approved',
      };

      const response = await mercadopago.preferences.create(preference);
      return response.body;
    } catch (error) {
      console.error('Error al crear la preferencia de Mercado Pago:', (error as Error).message);
      throw new Error('Error al crear la preferencia de Mercado Pago');
    }
  }

  async capturarPago(paymentId: string, userId: number) {
    try {
      const response = await mercadopago.payment.get(paymentId);

      if (response.body.status === 'approved') {
        const usuario = await this.authRepository.findOne({ where: { id: userId } });
        if (!usuario) {
          throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
        }

        const pago = this.pagoRepository.create({
          usuario,
          total: parseFloat(response.body.transaction_amount),
          items: response.body.items,
        });

        await this.pagoRepository.save(pago);

        // Vaciar el carrito
        await this.carritoService.limpiarCarrito(userId);

        // Actualizar existencias de productos
        const items = response.body.items;
        for (const item of items) {
          const producto = await this.productoRepository.findOne({ where: { producto: item.title } });
          if (producto) {
            producto.existencias -= item.quantity;
            if (producto.existencias < 0) {
              throw new BadRequestException(`No hay suficientes existencias para el producto con ID ${producto.id}`);
            }
            await this.productoRepository.save(producto);
          }
        }

        return {
          message: 'Pago capturado y guardado exitosamente',
          status: HttpStatus.OK,
        };
      } else {
        return {
          message: 'El pago no fue aprobado',
          status: HttpStatus.BAD_REQUEST,
        };
      }
    } catch (error) {
      console.error('Error al capturar el pago de Mercado Pago:', (error as Error).message);
      throw new Error(`Error al capturar el pago de Mercado Pago: ${(error as Error).message}`);
    }
  }
}*/
