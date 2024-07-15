import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrusel } from './entities/carrusel.entity';
import { CreateCarruselDto } from './dto/create-carrusel.dto';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

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
    console.log('Iniciando subida de imagen...');
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          console.error('Error al subir imagen:', error);
          return reject(error);
        }
        console.log('Imagen subida con éxito:', result);
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
