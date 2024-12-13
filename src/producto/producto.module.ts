import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { MulterModule } from '@nestjs/platform-express';
import { NotificationModule } from 'src/Notificaciones/notification.module';
import { SubcategoriaModule } from 'src/subcategoria/subcategoria.module';  // Importa el módulo de notificaciones

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    MulterModule.register(),
    NotificationModule,
    SubcategoriaModule // Asegúrate de importar el módulo aquí
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
})
export class ProductoModule {}
