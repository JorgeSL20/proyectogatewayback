// src/pago/pago.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { CarritoModule } from 'src/carrito/carrito.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago, Auth]),
    forwardRef(() => CarritoModule),
  ],
  providers: [PagoService],
  controllers: [PagoController],
  exports: [PagoService],
})
export class PagoModule {}
