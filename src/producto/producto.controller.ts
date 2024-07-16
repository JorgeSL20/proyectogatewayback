// src/producto/producto.controller.ts
import { Controller, Post, Get, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Body } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() createProductoDto: CreateProductoDto) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const result = await this.productoService.uploadImage(file);
    createProductoDto.url = result.secure_url;
    createProductoDto.publicId = result.public_id;
    return this.productoService.create(createProductoDto);
  }

  @Get()
  async findAll() {
    return this.productoService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    await this.productoService.remove(parsedId);
    return `Producto con ID ${id} eliminado correctamente`;
  }
}
