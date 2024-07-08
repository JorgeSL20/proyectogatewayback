import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { LoginModule } from './login/login.module';
import { RecuperarPassModule } from './recuperar-pass/recuperar-pass.module';
import { ProductoModule } from './producto/producto.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'roundhouse.proxy.rlwy.net',//roundhouse.proxy.rlwy.net
    port: 19513,
    username: 'root',
    password: 'lHluoAmqEbVXpvUXCDeiCLbtNvHTQLon',
    database: 'railway',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), AuthModule, EmailModule, LoginModule, RecuperarPassModule, ProductoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 