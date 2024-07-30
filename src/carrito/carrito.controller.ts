import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Put } from '@nestjs/common';
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

  @Get('items/:usuarioId')
  async obtenerItemsCarrito(@Param('usuarioId') usuarioId: string) {
    const id = parseInt(usuarioId, 10);
    return this.carritoService.findByUsuarioId(id);
  }

  @Delete('eliminar/:id')
  async eliminarItem(@Param('id') id: string) {
    return this.carritoService.remove(parseInt(id, 10));
  }

  @Put('actualizar-cantidad/:id')
  async actualizarCantidad(@Param('id') id: string, @Body('cantidad') cantidad: number) {
    return this.carritoService.actualizarCantidad(parseInt(id, 10), cantidad);
  }
}
