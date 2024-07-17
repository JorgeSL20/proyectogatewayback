import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { Auth } from 'src/auth/entities/auth.entity'; // Asegúrate de importar correctamente la entidad Auth si no lo has hecho

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
  ) {}

  async agregarItem(agregarItemDto: { usuarioId: number; productoId: number; cantidad: number }) {
    // Implementa la lógica para agregar un item al carrito
  }

  async obtenerItemsCarrito(usuario: Auth): Promise<Carrito[]> {
    return this.carritoRepository.find({ where: { usuario } });
  }

  async mostrarTodo(): Promise<Carrito[]> {
    return this.carritoRepository.find(); // Retorna todos los elementos del carrito
  }

  async eliminarItem(id: number): Promise<void> {
    await this.carritoRepository.delete(id);
  }
}
