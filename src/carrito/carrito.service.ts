import { Injectable, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { CrearCarritoDto } from './dto/create-carrito.dto';
import { Auth } from 'src/auth/entities/auth.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { PayPalService } from 'src/pago/pago.service';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private paypalService: PayPalService,
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

  async procesarPago(userId: number) {
    const items = await this.findByUsuarioId(userId);
    if (items.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    const total = items.reduce((acc, item) => acc + item.productoPrecio * item.cantidad, 0);
    const order = await this.paypalService.createOrder(total, items);

    // Guarda la orden en la base de datos
    await this.guardarOrden(userId, order);

    return {
      orderId: order.id,
      status: HttpStatus.OK,
    };
  }

  async capturarPago(orderId: string) {
    const capture = await this.paypalService.captureOrder(orderId);

    // Guarda la captura en la base de datos
    await this.guardarCaptura(orderId, capture);

    return {
      capture,
      message: 'Pago capturado exitosamente',
      status: HttpStatus.OK,
    };
  }

  private async guardarOrden(userId: number, order: any) {
    // Lógica para guardar la orden en la base de datos
  }

  private async guardarCaptura(orderId: string, capture: any) {
    // Lógica para guardar la captura en la base de datos
  }

  async enviarConfirmacion(userId: number) {
    const usuario = await this.authRepository.findOne({ where: { id: userId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Aquí puedes agregar la lógica para enviar la confirmación
    // Por ejemplo, enviar un correo electrónico con los detalles de la compra

    return {
      message: 'Confirmación enviada correctamente',
      status: HttpStatus.OK,
    };
  }
}
