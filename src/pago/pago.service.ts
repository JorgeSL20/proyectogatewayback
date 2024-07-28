import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PagoService {
  private readonly paypalApiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Pago)
    private pagoRepository: Repository<Pago>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {
    const isLive = this.configService.get<boolean>('PAYPAL_LIVE_MODE');
    this.paypalApiUrl = isLive ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com';
    this.clientId = this.configService.get<string>(isLive ? 'PAYPAL_CLIENT_ID_LIVE' : 'PAYPAL_CLIENT_ID_SANDBOX');
    this.clientSecret = this.configService.get<string>(isLive ? 'PAYPAL_CLIENT_SECRET_LIVE' : 'PAYPAL_CLIENT_SECRET_SANDBOX');
  }

  async procesarPago(pagoData: any) {
    const { total, items, userId } = pagoData;

    const auth = await firstValueFrom(
      this.httpService.post(
        `${this.paypalApiUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          auth: {
            username: this.clientId,
            password: this.clientSecret,
          },
        }
      )
    );

    const accessToken = auth.data.access_token;

    const createOrder = await firstValueFrom(
      this.httpService.post(
        `${this.paypalApiUrl}/v2/checkout/orders`,
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'MXN',
                value: total,
              },
              items: items.map((item: any) => ({
                name: item.nombre,
                unit_amount: {
                  currency_code: 'MXN',
                  value: item.precio,
                },
                quantity: item.cantidad,
              })),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
    );

    // Guardar información del pago en la base de datos
    const usuario = await this.authRepository.findOne({ where: { id: userId } });
    const pago = this.pagoRepository.create({
      usuario,
      total,
      items,
    });
    await this.pagoRepository.save(pago);

    return {
      message: 'Pago procesado exitosamente',
      orderId: createOrder.data.id,
      status: createOrder.status,
    };
  }

  async enviarConfirmacion(confirmacionData: any) {
    const { userId, orderId } = confirmacionData;

    // Aquí puedes agregar la lógica para enviar la confirmación
    // Por ejemplo, enviar un correo electrónico con los detalles del pedido

    return {
      message: 'Confirmación enviada correctamente',
      status: 200,
    };
  }
}
