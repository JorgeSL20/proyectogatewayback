import { Module } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { PagoService } from 'src/pago/pago.service';
import { Pago } from 'src/pago/entities/pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrito, Auth, Producto, Pago])],
  controllers: [CarritoController],
  providers: [CarritoService, PagoService],
  exports: [CarritoService],
})
export class CarritoModule {}
