import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
  ) {}

  async agregarItem(usuario: Auth, producto: Producto, cantidad: number): Promise<Carrito> {
    const carritoItem = new Carrito();
    carritoItem.usuario = usuario;
    carritoItem.producto = producto;
    carritoItem.cantidad = cantidad;
    return this.carritoRepository.save(carritoItem);
  }

  async obtenerItemsCarrito(usuario: Auth): Promise<Carrito[]> {
    return this.carritoRepository.find({ where: { usuario } });
  }

  async eliminarItem(id: number): Promise<void> {
    await this.carritoRepository.delete(id);
  }
}
