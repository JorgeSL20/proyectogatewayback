import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const CorsOptions: CorsOptions = {
    origin:[ 'https://proyectogatewayback-production.up.railway.app','https://gateway-soluciones.netlify.app', 'http://localhost:4200', 'http://localhost:8100', 'http://192.168.59.1:8100'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  }


  app.enableCors(CorsOptions);

  await app.listen( process.env.PORT || 3000 );
}
bootstrap();
