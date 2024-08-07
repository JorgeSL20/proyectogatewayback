import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Put,NotFoundException } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CrearCarritoDto } from './dto/create-carrito.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('carrito')
@UseGuards(AuthGuard)
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post('agregar-o-actualizar')
  async agregarOActualizarItem(@Body() crearCarritoDto: CrearCarritoDto, @Req() req) {
    const userId = req.user.id;
    return this.carritoService.createOrUpdate(crearCarritoDto, userId);
  }

  @Get()
  async findAll() {
    return this.carritoService.findAll();
  }

  @Get('items')
  async obtenerItemsCarrito(@Req() req) {
    const userId = req.user.id;
    return this.carritoService.findByUsuarioId(userId);
  }

  @Delete('eliminar/:id')
  async eliminarItem(@Param('id') id: string) {
    return this.carritoService.remove(parseInt(id, 10));
  }

  @Put('actualizar-cantidad/:id')
  async actualizarCantidad(@Param('id') id: string, @Body() body: { cantidad: number }) {
    const cantidad = body.cantidad;
    const resultado = await this.carritoService.actualizarCantidad(parseInt(id, 10), cantidad);

    if (!resultado) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    return resultado;
  }

  @Delete('vaciar')
  async vaciarCarrito(@Req() req): Promise<void> {
    const userId = req.user.id;
    await this.carritoService.limpiarCarrito(userId);
  }

  @Post('procesar-pago')
  async procesarPago(@Req() req): Promise<void> {
    const userId = req.user.id;
    await this.carritoService.procesarPago(userId);
  }
}
