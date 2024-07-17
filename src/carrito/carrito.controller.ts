import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
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
  async mostrarTodo() {
    return this.carritoService.findAll();
  }

  @Get(':usuarioId')
  async obtenerItemsCarrito(@Param('usuarioId') usuarioId: string) {
    const parsedUsuarioId = parseInt(usuarioId, 10);
    return this.carritoService.findByUsuarioId(parsedUsuarioId);
  }

  @Delete('eliminar/:id')
  async eliminarItem(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    return this.carritoService.remove(parsedId);
  }
}
