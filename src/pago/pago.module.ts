// src/pago/pago.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { AuthModule } from 'src/auth/auth.module'; // Importa AuthModule
import { CarritoModule } from 'src/carrito/carrito.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago]),
    forwardRef(() => CarritoModule),
    forwardRef(() => AuthModule), // Añade AuthModule aquí
  ],
  providers: [PagoService],
  controllers: [PagoController],
  exports: [PagoService],
})
export class PagoModule {}
