import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { SubcategoriaService } from './subcategoria.service';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';

@Controller('subcategoria')
export class SubcategoriaController {
  constructor(private readonly subcategoriaService: SubcategoriaService) {}

  @Post()
  async create(@Body() createSubcategoriaDto: CreateSubcategoriaDto) {
    try {
      return await this.subcategoriaService.create(createSubcategoriaDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error al crear subcategoría', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll() {
    return this.subcategoriaService.findAll();
  }

  @Get('verificar/:subcategoria')
  async verificar(@Param('subcategoria') subcategoria: string) {
    try {
      const exists = await this.subcategoriaService.verificarSubcategoriaUnica(subcategoria);
      return { unique: !exists };
    } catch (error) {
      throw new HttpException('Error al verificar subcategoría', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSubcategoriaDto: UpdateSubcategoriaDto) {
    const parsedId = parseInt(id, 10);
    return this.subcategoriaService.updateById(parsedId, updateSubcategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    return this.subcategoriaService.remove(parsedId);
  }
}
