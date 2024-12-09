import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { MulterModule } from '@nestjs/platform-express';
// Importa el módulo de notificaciones

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    MulterModule.register(),// Importa el módulo correctamente aquí
  ],
  controllers: [ProductoController],
  providers: [ProductoService], // No necesitas incluir NotificationsModule aquí
  exports: [ProductoService],
})
export class ProductoModule {}
