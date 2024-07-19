import { Controller, Get, Post, Body, Param, Delete, Headers } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CrearCarritoDto } from './dto/create-carrito.dto';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post('agregar')
  async agregarItem(
    @Body() crearCarritoDto: CrearCarritoDto,
    @Headers('authorization') token: string
  ) {
    // Obtener el ID del usuario del token
    const userId = parseInt(token.replace('Bearer ', ''), 10);
    
    // Asignar el usuarioId al DTO
    crearCarritoDto.usuarioId = userId;

    return this.carritoService.create(crearCarritoDto);
  }

  @Get()
  async findAll() {
    return this.carritoService.findAll();
  }

  @Get('items')
  async obtenerItemsCarrito(
    @Headers('authorization') token: string
  ) {
    const userId = parseInt(token.replace('Bearer ', ''), 10);
    return this.carritoService.findByUsuarioId(userId);
  }

  @Delete('eliminar/:id')
  async eliminarItem(
    @Param('id') id: string,
    @Headers('authorization') token: string
  ) {
    // Validar el ID del usuario del token si es necesario
    const userId = parseInt(token.replace('Bearer ', ''), 10);

    // Puedes usar userId aquí si necesitas hacer alguna verificación adicional

    return this.carritoService.remove(parseInt(id, 10));
  }
}
