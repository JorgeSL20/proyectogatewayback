import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { CrearCarritoDto } from './dto/create-carrito.dto';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
  ) {}

  async create(crearCarritoDto: CrearCarritoDto) {
    const newCarrito = this.carritoRepository.create(crearCarritoDto);
    return this.carritoRepository.save(newCarrito);
  }

  async remove(id: number) {
    await this.carritoRepository.delete(id);
    return {
      message: 'Item del carrito eliminado correctamente',
      status: HttpStatus.OK,
    };
  }

  async findAll() {
    return this.carritoRepository.find();
  }

  async findByUsuarioId(usuarioId: number) {
    return this.carritoRepository.find({ where: { usuario: { id: usuarioId } } });
  }
}
