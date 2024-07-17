import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { Auth } from 'src/auth/entities/auth.entity';
import { Carrito } from './entities/carrito.entity'; // Asegúrate de importar correctamente la entidad Carrito si no lo has hecho

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post('agregar')
  async agregarItem(@Body() agregarItemDto: { usuarioId: number; productoId: number; cantidad: number }) {
    return this.carritoService.agregarItem(agregarItemDto);
  }

  @Get(':usuarioId')
  async obtenerItemsCarrito(@Param('usuarioId') usuarioId: string) {
    const usuario = new Auth();
    usuario.id = parseInt(usuarioId, 10);
    return this.carritoService.obtenerItemsCarrito(usuario);
  }

  @Get()
  async mostrarTodo() {
    return this.carritoService.mostrarTodo(); // Debes implementar este método en el servicio CarritoService
  }

  @Delete('eliminar/:id')
  async eliminarItem(@Param('id') id: string) {
    return this.carritoService.eliminarItem(parseInt(id, 10));
  }
}
