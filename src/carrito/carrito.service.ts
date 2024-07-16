import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarritoItem } from './entities/carrito.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(CarritoItem)
    private carritoRepository: Repository<CarritoItem>,
  ) {}

  async agregarItem(usuario: Auth, producto: Producto, cantidad: number): Promise<CarritoItem> {
    const carritoItem = new CarritoItem();
    carritoItem.usuario = usuario;
    carritoItem.producto = producto;
    carritoItem.cantidad = cantidad;
    return this.carritoRepository.save(carritoItem);
  }

  async obtenerItemsCarrito(usuario: Auth): Promise<CarritoItem[]> {
    return this.carritoRepository.find({ where: { usuario } });
  }

  async eliminarItem(id: number): Promise<void> {
    await this.carritoRepository.delete(id);
  }
}
