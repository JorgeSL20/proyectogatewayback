import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Marca } from './entities/marca.entity';

@Injectable()
export class MarcaService {
  constructor(
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
  ) {}

  async create(createMarcaDto: CreateMarcaDto) {
    const marcaExistente = await this.marcaRepository.findOne({ where: { marca: createMarcaDto.marca } });
    if (marcaExistente) {
      throw new Error('La marca ya existe.');
    }
    const newMarca = this.marcaRepository.create(createMarcaDto);
    return this.marcaRepository.save(newMarca);
  }

  async updateById(id: number, updateMarcaDto: any) {
    const marcaExistente = await this.marcaRepository.findOne({ where: { marca: updateMarcaDto.marca } });
    if (marcaExistente && marcaExistente.id !== id) {
      throw new Error('La marca ya existe.');
    }
    await this.marcaRepository.update(id, { ...updateMarcaDto });
    return {
      message: 'Marca actualizada correctamente',
      status: HttpStatus.OK,
    };
  }

  async findAll() {
    return this.marcaRepository.find();
  }

  async findOne(id: number) {
    return this.marcaRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.marcaRepository.delete(id);
  }
}
