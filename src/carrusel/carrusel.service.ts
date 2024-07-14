// src/carrusel/carrusel.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrusel } from './entities/carrusel.entity';
import { CreateCarruselDto } from './dto/create-carrusel.dto';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dtma1qalx',
  api_key: '437213717654526',
  api_secret: 'fCn9EbX6KWqI1WZZ_aTOWgv986g',
});

@Injectable()
export class CarruselService {
  constructor(
    @InjectRepository(Carrusel)
    private carruselRepository: Repository<Carrusel>,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(file.buffer);
    });
  }

  async create(createCarruselDto: CreateCarruselDto): Promise<Carrusel> {
    const newCarrusel = this.carruselRepository.create(createCarruselDto);
    return this.carruselRepository.save(newCarrusel);
  }

  async findAll(): Promise<Carrusel[]> {
    return this.carruselRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.carruselRepository.delete(id);
  }
}
