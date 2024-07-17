import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { AuthModule } from 'src/auth/auth.module';  // Importa el AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrito, Producto]),  // Incluye las entidades necesarias
    AuthModule,  // Importa el AuthModule para que el AuthRepository esté disponible
  ],
  providers: [CarritoService],
  controllers: [CarritoController],
})
export class CarritoModule {}
