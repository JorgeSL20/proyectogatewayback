// src/carrito/carrito.service.ts
import { Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { CrearCarritoDto } from './dto/create-carrito.dto';
import { Auth } from 'src/auth/entities/auth.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async create(crearCarritoDto: CrearCarritoDto, userId: number) {
    const usuario = await this.authRepository.findOne({ where: { id: userId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const producto = await this.productoRepository.findOne({ where: { id: crearCarritoDto.productoId } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${crearCarritoDto.productoId} no encontrado`);
    }

    const newCarrito = this.carritoRepository.create({
      usuario: usuario,
      producto: producto,
      cantidad: crearCarritoDto.cantidad,
    });

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
    return this.carritoRepository.find({ relations: ['usuario', 'producto'] });
  }

  async findByUsuarioId(usuarioId: number) {
    const items = await this.carritoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario', 'producto'],
    });

    // Map items to include detailed product information
    return items.map(item => ({
      id: item.id,
      usuarioId: item.usuario.id,
      productoId: item.producto.id,
      productoNombre: item.producto.producto,
      productoImagen: item.producto.url,
      productoPrecio: item.producto.precio,
      cantidad: item.cantidad
    }));
  }
}
