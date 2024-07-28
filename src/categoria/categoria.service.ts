import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';



@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const newCategoria = this.categoriaRepository.create(createCategoriaDto);
    return this.categoriaRepository.save(newCategoria);
  }

  async remove(id: number) {
    return this.categoriaRepository.delete(id);
  }
  

 /*  async updateById(id: number, updateMarcaDto: UpdateMarcaDto) {
    await this.marcaRepository.update(id, { ...updateMarcaDto });
    return {
      message: 'Marca actualizada correctamente',
      status: HttpStatus.OK,
    };
  } */

  async findAll() {
    return this.categoriaRepository.find();
  }

  // async findOne(id: number) {
  //   return this.productoRepository.findOne(id);
  // }

  
}
