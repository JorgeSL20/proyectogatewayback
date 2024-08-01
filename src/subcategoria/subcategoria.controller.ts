import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SubcategoriaService } from './subcategoria.service';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';

@Controller('Subcategoria')
export class SubcategoriaController {
  constructor(private readonly SubcategoriaService: SubcategoriaService) {}

  @Post()
  create(@Body() createSubcategoriaDto: CreateSubcategoriaDto) {
    return this.SubcategoriaService.create(createSubcategoriaDto);
  }

  @Get()
  findAll() {
    return this.SubcategoriaService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSubcategoriaDto: UpdateSubcategoriaDto) {
    const parsedId = parseInt(id, 10);
    return this.SubcategoriaService.updateById(parsedId, updateSubcategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    return this.SubcategoriaService.remove(parsedId);
  }
}
