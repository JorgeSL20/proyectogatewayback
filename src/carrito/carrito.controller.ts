import { Controller, Get, Post, Body, Param, Delete, Request, HttpException,HttpStatus } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CrearCarritoDto } from './dto/create-carrito.dto';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post('agregar')
  async agregarItem(@Body() crearCarritoDto: CrearCarritoDto, @Request() req) {
    // Obtener el ID del usuario desde el token en el encabezado de la solicitud
    const usuarioId = req.headers['authorization'];

    if (!usuarioId) {
      throw new HttpException('Token no proporcionado', HttpStatus.UNAUTHORIZED);
    }

    // Llamar al servicio para agregar el ítem
    return this.carritoService.create({
      ...crearCarritoDto,
      usuarioId: parseInt(usuarioId, 10) // Asegúrate de que el token sea un número
    });
  }

  @Get()
  async findAll() {
    return this.carritoService.findAll();
  }

  @Get('items')
  async obtenerItemsCarrito(@Request() req) {
    const usuarioId = req.headers['authorization'];

    if (!usuarioId) {
      throw new HttpException('Token no proporcionado', HttpStatus.UNAUTHORIZED);
    }

    return this.carritoService.findByUsuarioId(parseInt(usuarioId, 10));
  }

  @Delete('eliminar/:id')
  async eliminarItem(@Param('id') id: string) {
    return this.carritoService.remove(parseInt(id, 10));
  }
}
