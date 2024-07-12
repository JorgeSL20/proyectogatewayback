import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const CorsOptions: CorsOptions = {
    origin:[ 'https://back-production.up.railway.app','https://main--gatewaysoluciones.netlify.app', 'http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  }

  app.enableCors(CorsOptions);

  await app.listen( process.env.PORT || 3000 );
}
bootstrap();
