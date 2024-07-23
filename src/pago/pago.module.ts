// src/pago/pago.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot()
  ],
  controllers: [PagoController],
  providers: [PagoService]
})
export class PagoModule {}
