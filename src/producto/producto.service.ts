import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    const newProducto = this.productoRepository.create(createProductoDto);
    return this.productoRepository.save(newProducto);
  }

  async remove(id: number) {
    return this.productoRepository.delete(id);
  }
  

  async updateById(id: number, updateProductoDto: UpdateProductoDto) {
    await this.productoRepository.update(id, { ...updateProductoDto });
    return {
      message: 'Producto actualizado correctamente',
      status: HttpStatus.OK,
    };
  }

  async findAll() {
    return this.productoRepository.find();
  }

  // async findOne(id: number) {
  //   return this.productoRepository.findOne(id);
  // }

  
}
