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
    const newMarca = this.marcaRepository.create(createMarcaDto);
    return this.marcaRepository.save(newMarca);
  }

  async remove(id: number) {
    return this.marcaRepository.delete(id);
  }
  

 /*  async updateById(id: number, updateMarcaDto: UpdateMarcaDto) {
    await this.marcaRepository.update(id, { ...updateMarcaDto });
    return {
      message: 'Marca actualizada correctamente',
      status: HttpStatus.OK,
    };
  } */

  async findAll() {
    return this.marcaRepository.find();
  }

  // async findOne(id: number) {
  //   return this.productoRepository.findOne(id);
  // }

  
}
