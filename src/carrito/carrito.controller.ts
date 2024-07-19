import { Controller, Post, Body, Get, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CrearCarritoDto } from './dto/create-carrito.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post('agregar')
  @UseGuards(AuthGuard)
  async agregarItem(@Body() crearCarritoDto: CrearCarritoDto, @Req() request) {
    const userId = request.user.id;
    return this.carritoService.create({ ...crearCarritoDto, userId });
  }

  @Get('items/:userId')
  async obtenerItemsCarrito(@Param('userId') userId: string) {
    return this.carritoService.findByUsuarioId(parseInt(userId, 10));
  }

  @Delete('eliminar/:id')
  async eliminarItem(@Param('id') id: string) {
    return this.carritoService.remove(parseInt(id, 10));
  }
}
