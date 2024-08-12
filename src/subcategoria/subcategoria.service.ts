import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategoria } from './entities/subcategoria.entity';

@Injectable()
export class SubcategoriaService {
  constructor(
    @InjectRepository(Subcategoria)
    private SubcategoriaRepository: Repository<Subcategoria>,
  ) {}

  async create(createSubcategoriaDto: CreateSubcategoriaDto) {
    const { categoria, subcategoria } = createSubcategoriaDto;

    // Verificar si la subcategoría ya existe en la misma categoría
    const existingSubcategoria = await this.SubcategoriaRepository.findOne({
      where: {
        categoria: categoria.trim().toLowerCase(),
        subcategoria: subcategoria.trim().toLowerCase(),
      },
    });

    if (existingSubcategoria) {
      throw new Error('Esta subcategoría ya existe en la categoría seleccionada');
    }

    const newSubcategoria = this.SubcategoriaRepository.create(createSubcategoriaDto);
    return this.SubcategoriaRepository.save(newSubcategoria);
  }

  async remove(id: number) {
    return this.SubcategoriaRepository.delete(id);
  }

  async updateById(id: number, updateSubcategoriaDto: UpdateSubcategoriaDto) {
    await this.SubcategoriaRepository.update(id, { ...updateSubcategoriaDto });
    return {
      message: 'Categoría actualizada correctamente',
      status: HttpStatus.OK,
    };
  }

  async findAll() {
    return this.SubcategoriaRepository.find();
  }
}
