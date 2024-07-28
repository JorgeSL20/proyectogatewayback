import { Controller, Post, Get, Param, Delete, Put, Body, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { CarruselService } from './carrusel.service';
import { CreateCarruselDto } from './dto/create-carrusel.dto';
import { UpdateCarruselDto } from './dto/update-carrusel.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('carrusel')
export class CarruselController {
  constructor(private readonly carruselService: CarruselService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createCarruselDto: CreateCarruselDto) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const result = await this.carruselService.uploadImage(file);
    createCarruselDto.url = result.secure_url;
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
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateCarruselDto: UpdateCarruselDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const parsedId = parseInt(id, 10);

    if (file) {
      const result = await this.carruselService.uploadImage(file);
      updateCarruselDto.url = result.secure_url;
    }

    return this.carruselService.updateById(parsedId, updateCarruselDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    await this.carruselService.remove(parsedId);
    return `Carrusel con ID ${id} eliminado correctamente`;
  }
}
