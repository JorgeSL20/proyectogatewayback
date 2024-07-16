import { Controller, Post, Body, Param, Delete } from '@nestjs/common'; // Asegúrate de importar Param desde '@nestjs/common'
import { CarritoService } from './carrito.service';
import { Auth } from 'src/auth/entities/auth.entity';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post('agregar')
  async agregarItem(@Body() agregarItemDto: { usuarioId: number; productoId: number; cantidad: number }) {
    return this.carritoService.agregarItem(agregarItemDto);
  }

  @Post('obtener')
  async obtenerItemsCarrito(@Body('usuarioId') usuarioId: number) {
    const usuario = new Auth();
    usuario.id = usuarioId;
    return this.carritoService.obtenerItemsCarrito(usuario);
  }

  @Delete('eliminar/:id')
  async eliminarItem(@Param('id') id: string) { // Aquí se utiliza el decorador @Param correctamente
    return this.carritoService.eliminarItem(parseInt(id, 10));
  }
}
