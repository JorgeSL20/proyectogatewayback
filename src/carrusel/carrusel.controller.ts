import { Controller, Post, Get, Param, Delete, Put, Body, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { CarruselService } from './carrusel.service';
import { CreateCarruselDto } from './dto/create-carrusel.dto';
import { UpdateCarruselDto } from './dto/update-carrusel.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('carrusel')
export class CarruselController {
  constructor(private readonly carruselService: CarruselService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const result = await this.carruselService.uploadImage(file);
    return { secure_url: result.secure_url };
  }

  @Post()
  async create(@Body() createCarruselDto: CreateCarruselDto) {
    return this.carruselService.create(createCarruselDto);
  }

  @Get()
  async findAll() {
    return this.carruselService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    return this.carruselService.findOne(parsedId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCarruselDto: UpdateCarruselDto) {
    const parsedId = parseInt(id, 10);
    return this.carruselService.updateById(parsedId, updateCarruselDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    await this.carruselService.remove(parsedId);
    return `Carrusel con ID ${id} eliminado correctamente`;
  }
}
