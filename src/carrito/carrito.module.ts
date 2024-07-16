import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { Carrito } from './entities/carrito.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrito, Auth, Producto])],
  providers: [CarritoService],
  controllers: [CarritoController],
})
export class CarritoModule {}
