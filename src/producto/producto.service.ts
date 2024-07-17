// src/producto/producto.service.ts
import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';


cloudinary.config({
  cloud_name: 'dkwb9vcbb',
  api_key: '724994365615579',
  api_secret: 'KXXzGbwWPb6-j5Cpfpxx6P1SvDA',
});

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

  async remove(id: number): Promise<void> {
    await this.productoRepository.delete(id);
  }

  async updateById(id: number, updateProductoDto: UpdateProductoDto) {
    await this.productoRepository.update(id, { ...updateProductoDto });
    return {
      message: 'Producto actualizado correctamente',
      status: HttpStatus.OK,
    };
  }
}

