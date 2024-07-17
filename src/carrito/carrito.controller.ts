import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CrearCarritoDto } from './dto/create-carrito.dto';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post()
  create(@Body() crearCarritoDto: CrearCarritoDto) {
    return this.carritoService.create(crearCarritoDto);
  }

  @Get()
  findAll() {
    return this.carritoService.findAll();
  }

  @Get(':usuarioId')
  findByUsuarioId(@Param('usuarioId') usuarioId: string) {
    const parsedUsuarioId = parseInt(usuarioId, 10);
    return this.carritoService.findByUsuarioId(parsedUsuarioId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    return this.carritoService.remove(parsedId);
  }
}
