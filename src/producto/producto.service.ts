import {
  Injectable,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { NotificationsController } from 'src/Notificaciones/notification.controller';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private notificationsController: NotificationsController,
  ) {}

  // Subir imágenes a Cloudinary
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'producto_images',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  // Crear producto y enviar notificación
  async create(createProductoDto: CreateProductoDto, file?: Express.Multer.File) {
    try {
      if (file) {
        // Manejar la imagen si se sube
        const imageResult = await this.uploadImage(file);
        createProductoDto.url = imageResult.secure_url;
      }

      const newProducto = this.productoRepository.create(createProductoDto);
      const savedProducto = await this.productoRepository.save(newProducto);

      // Enviar notificación
      const notificationPayload = {
        notification: {
          title: 'Nuevo producto agregado',
          body: `Producto: ${savedProducto.producto}`,
          icon: '/assets/icons/icon-72x72.png',
        },
      };
      this.notificationsController.sendNotification(notificationPayload);

      return savedProducto;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw new InternalServerErrorException('Error al crear producto');
    }
  }

  // Obtener todos los productos
  async findAll(
    orderBy: string = 'fechaCreacion',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Producto[]> {
    return this.productoRepository.find({
      order: {
        [orderBy]: order,
      },
    });
  }

  // Obtener producto por ID
  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new BadRequestException('Producto no encontrado');
    }
    return producto;
  }

  // Actualizar producto por ID
  async updateById(id: number, updateProductoDto: UpdateProductoDto, file?: Express.Multer.File) {
    try {
      if (file) {
        const result = await this.uploadImage(file);
        updateProductoDto.url = result.secure_url;
      }

      const updateResult = await this.productoRepository.update(id, { ...updateProductoDto });
      if (updateResult.affected === 0) {
        throw new BadRequestException('Producto no encontrado');
      }

      return {
        message: 'Producto actualizado correctamente',
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw new InternalServerErrorException('Error al actualizar producto');
    }
  }

  // Eliminar producto
  async remove(id: number): Promise<void> {
    const deleteResult = await this.productoRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new BadRequestException('Producto no encontrado');
    }
  }
}
