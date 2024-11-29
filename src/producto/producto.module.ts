// src/producto/producto.module.ts
import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { MulterModule } from '@nestjs/platform-express';
import { NotificationsModule } from 'src/websocket/notifications.module';// Importa el módulo de notificaciones

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    MulterModule.register(), // Configuración de Multer
    NotificationsModule, // Importa el módulo de notificaciones
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
})
export class ProductoModule {}
