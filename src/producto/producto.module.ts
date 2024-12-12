import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { MulterModule } from '@nestjs/platform-express';
import { NotificationModule } from 'src/Notificaciones/notification.module'; // Importa NotificationsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    MulterModule.register(), // Configura Multer si es necesario
    NotificationModule, // Importa el módulo de notificaciones
  ],
  controllers: [ProductoController],
  providers: [ProductoService], // Incluir ProductoService
  exports: [ProductoService],
})
export class ProductoModule {}
