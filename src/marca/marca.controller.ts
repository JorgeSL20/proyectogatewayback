import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';


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

  @Delete(':id')
  remove(@Param('id') id: string) {
    const parsedId = parseInt(id, 10); // Convertir el ID a número entero
    return this.marcaService.remove(parsedId);
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