// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth, Informacion, Preguntas } from './entities/auth.entity';
import { Logs } from './entities/logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, Informacion, Preguntas, Logs])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, TypeOrmModule], // Asegúrate de exportar TypeOrmModule también
})
export class AuthModule {}
