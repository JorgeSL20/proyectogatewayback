import { Injectable, HttpStatus } from '@nestjs/common';
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
    await this.productoRepository.update(id, { ...updateProductoDto });
    return {
      message: 'Producto actualizado correctamente',
      status: HttpStatus.OK,
    };
  }

  async remove(id: number): Promise<void> {
    await this.productoRepository.delete(id);
  }
}
