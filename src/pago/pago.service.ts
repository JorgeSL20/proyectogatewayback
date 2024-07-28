// paypal.service.ts
import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PayPalService {
  private environment: paypal.core.LiveEnvironment | paypal.core.SandboxEnvironment;
  private client: paypal.core.PayPalHttpClient;

  constructor() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    // Cambiar a LiveEnvironment para producción
    this.environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
    // Si necesitas cambiar a sandbox para pruebas, usa esta línea en lugar de la anterior
    // this.environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);

    this.client = new paypal.core.PayPalHttpClient(this.environment);
  }

  async createOrder(total: number, items: any[]) {
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

  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const response = await this.client.execute(request);
    return response.result;
  }
}
