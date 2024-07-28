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
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.paypalApiUrl = 'https://api.sandbox.paypal.com'; // Cambiar a la URL de producción cuando esté listo
    this.clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
  }

  async procesarPago(pagoData: any) {
    const token = await this.generateAccessToken();
    // Implementar la lógica para procesar el pago con PayPal usando el token
    const pago = new Pago();
    pago.amount = pagoData.amount;
    pago.currency = pagoData.currency;
    pago.status = 'pending';
    pago.transactionId = 'transaction_id'; // Debe ser generado adecuadamente
    pago.usuario = await this.authRepository.findOne(pagoData.usuarioId);

    await this.pagoRepository.save(pago);

    return { success: true, message: 'Pago procesado exitosamente', pago };
  }

  private async generateAccessToken(): Promise<string> {
    const response = await firstValueFrom(this.httpService.post(
      `${this.paypalApiUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: {
          username: this.clientId,
          password: this.clientSecret
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ));
    return response.data.access_token;
  }

  async enviarConfirmacion(confirmacionData: any) {
    // Implementar la lógica para enviar el correo de confirmación
    return { success: true, message: 'Correo de confirmación enviado' };
  }
}
