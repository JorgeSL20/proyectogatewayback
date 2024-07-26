import { Injectable, HttpStatus,BadRequestException,InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'producto_images',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(file.buffer);
    });
  }

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    console.log('CreateProductoDto en servicio:', createProductoDto); // Log para verificar datos
    const newProducto = this.productoRepository.create(createProductoDto);
    return this.productoRepository.save(newProducto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    return this.productoRepository.findOne({ where: { id } });
  }

  async updateById(id: number, updateProductoDto: UpdateProductoDto) {
    try {
      const result = await this.productoRepository.update(id, { ...updateProductoDto });
      if (result.affected === 0) {
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
  

  async remove(id: number): Promise<void> {
    await this.productoRepository.delete(id);
  }
}
