import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CrearCarritoDto } from './dto/create-carrito.dto';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post('agregar')
  async agregarItem(@Body() crearCarritoDto: CrearCarritoDto) {
    return this.carritoService.create(crearCarritoDto);
  }

  @Get()
  async findAll() {
    return this.carritoService.findAll();
  }

  @Get(':usuarioId')
  async obtenerItemsCarrito(@Param('usuarioId') usuarioId: string) {
    const id = parseInt(usuarioId, 10);
    return this.carritoService.findByUsuarioId(id);
  }

  @Delete('eliminar/:id')
  async eliminarItem(@Param('id') id: string) {
    return this.carritoService.remove(parseInt(id, 10));
  }
}
