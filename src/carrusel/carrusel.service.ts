import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrusel } from './entities/carrusel.entity';
import { CreateCarruselDto } from './dto/create-carrusel.dto';
import { UpdateCarruselDto } from './dto/update-carrusel.dto';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';

cloudinary.config({
  cloud_name: 'dkwb9vcbb',
  api_key: '724994365615579',
  api_secret: 'KXXzGbwWPb6-j5Cpfpxx6P1SvDA',
});

@Injectable()
export class CarruselService {
  constructor(
    @InjectRepository(Carrusel)
    private carruselRepository: Repository<Carrusel>,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'carrusel_images',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(file.buffer);
    });
  }

  async create(createCarruselDto: CreateCarruselDto): Promise<Carrusel> {
    const newCarrusel = this.carruselRepository.create(createCarruselDto);
    return this.carruselRepository.save(newCarrusel);
  }

  async findAll(): Promise<Carrusel[]> {
    return this.carruselRepository.find();
  }

  async findOne(id: number): Promise<Carrusel> {
    return this.carruselRepository.findOneBy({ id });
  }

  async updateById(id: number, updateCarruselDto: UpdateCarruselDto): Promise<Carrusel> {
    await this.carruselRepository.update(id, updateCarruselDto);
    return this.carruselRepository.findOneBy({ id });
  }

  // Agrega esta función en el servicio
private extractPublicId(url: string): string {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  const publicId = lastPart.split('.')[0]; // Assuming the public ID is before the file extension
  return publicId;
}

// Cambia la función `remove` por la siguiente
async remove(id: number): Promise<void> {
  const carrusel = await this.carruselRepository.findOneBy({ id });
  if (carrusel && carrusel.url) {
    const publicId = this.extractPublicId(carrusel.url);
    await cloudinary.uploader.destroy(publicId);
    await this.carruselRepository.delete(id);
  }
}

}
