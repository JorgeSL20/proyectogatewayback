// src/pago/pago.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PagoService } from './pago.service';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post()
  async procesarPago(@Body() pagoData: any) {
    return this.pagoService.procesarPago(pagoData);
  }

  @Post('enviar-confirmacion')
  async enviarConfirmacion(@Body() confirmacionData: any) {
    return this.pagoService.enviarConfirmacion(confirmacionData);
  }
}
