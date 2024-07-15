import { Controller, Post, Get, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { CarruselService } from './carrusel.service';
import { CreateCarruselDto } from './dto/create-carrusel.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('carrusel')
export class CarruselController {
  constructor(private readonly carruselService: CarruselService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Asegúrate de que 'file' coincide con el nombre del campo en el formulario HTML
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const result = await this.carruselService.uploadImage(file);
    const createCarruselDto: CreateCarruselDto = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    return this.carruselService.create(createCarruselDto);
  }

  @Get()
  async findAll() {
    return this.carruselService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    await this.carruselService.remove(parsedId);
    return `Carrusel con ID ${id} eliminado correctamente`;
  }
}
