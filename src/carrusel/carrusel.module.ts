import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrusel } from './entities/carrusel.entity';
import { CarruselController } from './carrusel.controller';
import { CarruselService } from './carrusel.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrusel]),
    MulterModule.register(), // No necesitas especificar un destino si no quieres almacenar localmente
  ],
  controllers: [CarruselController],
  providers: [CarruselService],
})
export class CarruselModule {}
