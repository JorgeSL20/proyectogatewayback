import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategoria } from './entities/subcategoria.entity';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';

@Injectable()
export class SubcategoriaService {
  constructor(
    @InjectRepository(Subcategoria)
    private subcategoriaRepository: Repository<Subcategoria>,
  ) {}

  async create(createSubcategoriaDto: CreateSubcategoriaDto) {
    const { subcategoria } = createSubcategoriaDto;

    // Verificar si la subcategoría ya existe
    const existingSubcategoria = await this.subcategoriaRepository.findOne({ where: { subcategoria } });
    if (existingSubcategoria) {
      throw new BadRequestException('La subcategoría ya existe');
    }

    const newSubcategoria = this.subcategoriaRepository.create(createSubcategoriaDto);
    return this.subcategoriaRepository.save(newSubcategoria);
  }

  async remove(id: number) {
    return this.subcategoriaRepository.delete(id);
  }

  async updateById(id: number, updateSubcategoriaDto: UpdateSubcategoriaDto) {
    await this.subcategoriaRepository.update(id, { ...updateSubcategoriaDto });
    return {
      message: 'Subcategoría actualizada correctamente',
      status: HttpStatus.OK,
    };
  }

  async findAll() {
    return this.subcategoriaRepository.find();
  }

  async verificarSubcategoriaUnica(subcategoria: string): Promise<boolean> {
    const existingSubcategoria = await this.subcategoriaRepository.findOne({ where: { subcategoria } });
    return !!existingSubcategoria;
  }
}
