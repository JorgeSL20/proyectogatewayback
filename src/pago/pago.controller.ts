/*import { Controller, Post, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { PagoService } from './pago.service';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post('crear-orden')
  async crearOrden(@Body() pagoData: any, @Req() req) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User ID is undefined');
    }
    return this.pagoService.crearOrden(pagoData);
  }

  @Post('capturar-pago')
  async capturarPago(@Body() body: { paymentId: string }, @Req() req) {
    const { paymentId } = body;

    if (!paymentId) {
      throw new BadRequestException('Payment ID is required');
    }

    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User ID is undefined');
    }

    return this.pagoService.capturarPago(paymentId, userId);
  }
}*/
