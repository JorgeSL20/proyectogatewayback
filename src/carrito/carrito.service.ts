import { Injectable, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async createOrUpdate(crearCarritoDto: CrearCarritoDto, userId: number) {
    const usuario = await this.authRepository.findOne({ where: { id: userId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const producto = await this.productoRepository.findOne({ where: { id: crearCarritoDto.productoId } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${crearCarritoDto.productoId} no encontrado`);
    }

    if (producto.existencias < crearCarritoDto.cantidad) {
      throw new BadRequestException(`No hay suficientes existencias del producto con ID ${crearCarritoDto.productoId}`);
    }

    let carritoItem = await this.carritoRepository.findOne({
      where: { usuario: { id: userId }, producto: { id: crearCarritoDto.productoId } },
      relations: ['usuario', 'producto'],
    });

    if (carritoItem) {
      carritoItem.cantidad += crearCarritoDto.cantidad;

      producto.existencias -= crearCarritoDto.cantidad;
      if (producto.existencias < 0) {
        throw new BadRequestException(`No hay suficientes existencias del producto con ID ${crearCarritoDto.productoId}`);
      }
      await this.productoRepository.save(producto);

      return this.carritoRepository.save(carritoItem);
    } else {
      const newCarrito = this.carritoRepository.create({
        usuario: usuario,
        producto: producto,
        cantidad: crearCarritoDto.cantidad,
      });

      producto.existencias -= crearCarritoDto.cantidad;
      await this.productoRepository.save(producto);

      return this.carritoRepository.save(newCarrito);
    }
  }

  async remove(id: number) {
    const carritoItem = await this.carritoRepository.findOne({ where: { id }, relations: ['producto'] });
    if (!carritoItem) {
      throw new NotFoundException(`Ítem del carrito con ID ${id} no encontrado`);
    }

    const producto = carritoItem.producto;
    producto.existencias += carritoItem.cantidad;
    await this.productoRepository.save(producto);

    await this.carritoRepository.delete(id);
    return {
      message: 'Item del carrito eliminado correctamente',
      status: HttpStatus.OK,
    };
  }

  async actualizarCantidad(id: number, nuevaCantidad: number) {
    const carritoItem = await this.carritoRepository.findOne({ where: { id }, relations: ['producto'] });
    if (!carritoItem) {
      throw new NotFoundException(`Ítem del carrito con ID ${id} no encontrado`);
    }

    const producto = carritoItem.producto;

    producto.existencias += carritoItem.cantidad - nuevaCantidad;
    if (producto.existencias < 0) {
      throw new NotFoundException(`No hay suficientes existencias para el producto con ID ${producto.id}`);
    }
    await this.productoRepository.save(producto);

    carritoItem.cantidad = nuevaCantidad;
    await this.carritoRepository.save(carritoItem);

    return {
      message: 'Cantidad actualizada correctamente',
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

  async limpiarCarrito(usuarioId: number) {
    const items = await this.carritoRepository.find({ where: { usuario: { id: usuarioId } }, relations: ['producto'] });
    
    // Devolver existencias al inventario
    for (const item of items) {
      const producto = item.producto;
      producto.existencias += item.cantidad;
      await this.productoRepository.save(producto);
    }

    await this.carritoRepository.remove(items);
  }
}
