import { Controller, Post, Get, Param, Delete, Put, Body, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createProductoDto: CreateProductoDto) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    console.log('CreateProductoDto:', createProductoDto); // Log para verificar datos
    const result = await this.productoService.uploadImage(file);
    createProductoDto.url = result.secure_url;
    return this.productoService.create(createProductoDto);
  }

  @Get()
  async findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    return this.productoService.findOne(parsedId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const parsedId = parseInt(id, 10);

    if (file) {
      // Maneja el archivo subido
      const result = await this.productoService.uploadImage(file);
      updateProductoDto.url = result.secure_url;
    }

    return this.productoService.updateById(parsedId, updateProductoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    await this.productoService.remove(parsedId);
    return `Producto con ID ${id} eliminado correctamente`;
  }
}
