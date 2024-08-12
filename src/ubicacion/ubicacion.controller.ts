import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { Ubicacion } from './entities/ubicacion.entity';

@Controller('ubicacion')
export class UbicacionController {
  constructor(private readonly ubicacionService: UbicacionService) {}

  @Patch(':id')
  async updateUbicacion(
    @Param('id') id: number,
    @Body() updateData: Partial<Ubicacion>,
  ): Promise<Ubicacion> {
    return this.ubicacionService.actualizar(id, updateData);
  }
  
  @Post()
  async create(@Body() createUbicacionDto: CreateUbicacionDto) {
    return this.ubicacionService.create(createUbicacionDto);
  }

  @Get()
  async findAll() {
    return this.ubicacionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ubicacionService.findOne(+id);
  }

  @Patch(':id')
async actualizarUbicacion(@Param('id') id: number, @Body() ubicacion: Ubicacion): Promise<Ubicacion> {
  return this.ubicacionService.actualizar(id, ubicacion);
}


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ubicacionService.remove(+id);
  }
}
