import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { LoginModule } from './login/login.module';
import { RecuperarPassModule } from './recuperar-pass/recuperar-pass.module';
import { ProductoModule } from './producto/producto.module';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import { MarcaModule } from './marca/marca.module';
import { CategoriaModule } from './categoria/categoria.module';
import { CarruselModule } from './carrusel/carrusel.module';
import { CarritoModule } from './carrito/carrito.module';
import { ConfigModule } from '@nestjs/config';
import { SubcategoriaModule } from './subcategoria/subcategoria.module';
import { NotificationsGateway } from './websocket/websocket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'viaduct.proxy.rlwy.net',//roundhouse.proxy.rlwy.net
    port: 24988,
    username: 'root',
    password: 'IuTDjpowqiGeIqaxVzBVRAJCmfcmkYPk',
    database: 'railway',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    
  }), AuthModule, EmailModule, LoginModule, RecuperarPassModule, ProductoModule, MarcaModule, CategoriaModule, CarruselModule,CarritoModule, UbicacionModule, SubcategoriaModule,NotificationsGateway],
  controllers: [AppController],
  providers: [AppService,NotificationsGateway],
})

export class AppModule {}
 