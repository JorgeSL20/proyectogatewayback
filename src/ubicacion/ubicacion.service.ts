import { Injectable, NotFoundException,InternalServerErrorException } from '@nestjs/common';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ubicacion } from './entities/ubicacion.entity';

@Injectable()
export class UbicacionService {
  constructor(
    @InjectRepository(Ubicacion)
    private ubicacionRepository: Repository<Ubicacion>,
  ) {}

  async create(createUbicacionDto: CreateUbicacionDto) {
    const newUbicacion = this.ubicacionRepository.create(createUbicacionDto);
    return this.ubicacionRepository.save(newUbicacion);
  }

  async findAll() {
    return this.ubicacionRepository.find();
  }

  async findOne(id: number) {
    const ubicacion = await this.ubicacionRepository.findOne({ where: { id } });
    if (!ubicacion) {
      throw new NotFoundException(`Ubicación con id ${id} no encontrada`);
    }
    return ubicacion;
  }

  async actualizar(id: number, updateData: Partial<Ubicacion>): Promise<Ubicacion> {
    await this.ubicacionRepository.update(id, updateData);
    return this.ubicacionRepository.findOneBy({ id });
  }
  
  

  async remove(id: number) {
    const result = await this.ubicacionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ubicación con id ${id} no encontrada`);
    }
    return { deleted: true };
  }
}
