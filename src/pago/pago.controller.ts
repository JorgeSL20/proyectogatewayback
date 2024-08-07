// pago.controller.ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PagoService } from './pago.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('pago')
@UseGuards(AuthGuard)
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post('crear-orden')
  async crearOrden(@Body() pagoData: any, @Req() req) {
    const userId = req.user.id;
    return this.pagoService.crearOrden(pagoData);
  }

  @Post('capturar-pago')
  async capturarPago(@Body('orderId') orderId: string, @Req() req) {
    console.log(`Order ID: ${orderId}`);
    const userId = req.user.id;
    return this.pagoService.capturarPago(orderId, userId);
  }
}
