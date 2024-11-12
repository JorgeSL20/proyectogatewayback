/*import { Module, forwardRef } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { AuthModule } from 'src/auth/auth.module'; // Importa AuthModule
import { CarritoModule } from 'src/carrito/carrito.module';
import { Producto } from 'src/producto/entities/producto.entity'; // Importa la entidad Producto

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago, Producto]), // Incluye Producto aquí
    forwardRef(() => CarritoModule),
    forwardRef(() => AuthModule), // Añade AuthModule aquí
  ],
  providers: [PagoService],
  controllers: [PagoController],
  exports: [PagoService],
})
export class PagoModule {}
*/