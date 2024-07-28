// src/pago/pago.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { CarritoModule } from 'src/carrito/carrito.module'; // Importa el CarritoModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago, Auth]),
    forwardRef(() => CarritoModule), // Usa forwardRef para CarritoModule
  ],
  providers: [PagoService],
  controllers: [PagoController],
  exports: [PagoService],  // Asegúrate de exportar PagoService
})
export class PagoModule {}
