// src/carrito/carrito.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { AuthModule } from 'src/auth/auth.module';  // Importa el AuthModule
//import { PagoModule } from 'src/pago/pago.module';  // Importa el PagoModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrito, Producto]),  // Incluye las entidades necesarias
    AuthModule,  // Importa el AuthModule para que el AuthRepository esté disponible
    //forwardRef(() => PagoModule), // Usa forwardRef para PagoModule
  ],
  providers: [CarritoService],
  controllers: [CarritoController],
  exports: [CarritoService], // Asegúrate de exportar CarritoService si otros módulos lo necesitan
})
export class CarritoModule {}
