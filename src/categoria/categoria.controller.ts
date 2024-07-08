import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';


@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  @Get()
  findAll() {
    return this.categoriaService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const parsedId = parseInt(id, 10); // Convertir el ID a número entero
    return this.categoriaService.remove(parsedId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productoService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
  //   return this.productoService.update(id, updateProductoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productoService.remove(id);
  // }
}