import { HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
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
    const { categoria } = createCategoriaDto;

    // Verificar si la categoría ya existe
    const existingCategoria = await this.categoriaRepository.findOne({ where: { categoria } });
    if (existingCategoria) {
      throw new BadRequestException('La categoría ya existe');
    }

    const newCategoria = this.categoriaRepository.create(createCategoriaDto);
    return this.categoriaRepository.save(newCategoria);
  }

  async remove(id: number) {
    return this.categoriaRepository.delete(id);
  }

  async updateById(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    await this.categoriaRepository.update(id, { ...updateCategoriaDto });
    return {
      message: 'Categoría actualizada correctamente',
      status: HttpStatus.OK,
    };
  }

  async findAll() {
    return this.categoriaRepository.find();
  }
}
