import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { LoginModule } from './login/login.module';
import { RecuperarPassModule } from './recuperar-pass/recuperar-pass.module';
import { ProductoModule } from './producto/producto.module';
import { MarcaModule } from './marca/marca.module';
import { CategoriaModule } from './categoria/categoria.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'viaduct.proxy.rlwy.net',//roundhouse.proxy.rlwy.net
    port: 24988,
    username: 'root',
    password: 'IuTDjpowqiGeIqaxVzBVRAJCmfcmkYPk',
    database: 'railway',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), AuthModule, EmailModule, LoginModule, RecuperarPassModule, ProductoModule, MarcaModule, CategoriaModule],
  controllers: [AppController],
  providers: [AppService],
})



export class AppModule {}
 