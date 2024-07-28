import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Auth } from 'src/auth/entities/auth.entity';
import { Pago } from './entities/pago.entity';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Auth, Pago],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Auth, Pago]),
    HttpModule,
  ],
  controllers: [PagoController],
  providers: [PagoService],
})
export class AppModule {}
