// src/ubicacion/ubicacion.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
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
    return this.ubicacionRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUbicacionDto: Partial<CreateUbicacionDto>) {
    await this.ubicacionRepository.update(id, updateUbicacionDto);
    return this.ubicacionRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.ubicacionRepository.delete(id);
    return { deleted: true };
  }
}
