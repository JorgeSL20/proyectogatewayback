// src/pago/pago.controller.ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PagoService } from './pago.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('pago')
@UseGuards(AuthGuard)
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post('procesar-pago')
  async procesarPago(@Body() pagoData: any, @Req() req) {
    const userId = req.user.id;
    return this.pagoService.procesarPago(pagoData, userId);
  }

  @Post('capturar-pago')
  async capturarPago(@Body('orderId') orderId: string, @Req() req) {
    const userId = req.user.id;
    return this.pagoService.capturarPago(orderId, userId);
  }
}
