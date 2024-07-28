import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';  // Asegúrate de tener este DTO

@Controller('marca')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @Post()
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcaService.create(createMarcaDto);
  }

  @Get()
  findAll() {
    return this.marcaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    return this.marcaService.findOne(parsedId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcaDto) {
    const parsedId = parseInt(id, 10);
    return this.marcaService.updateById(parsedId, updateMarcaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    return this.marcaService.remove(parsedId);
  }
}
