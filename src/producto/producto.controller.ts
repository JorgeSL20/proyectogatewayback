import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { SubscriptionService } from 'src/Subcripcion/subscription.service'; // Servicio de suscripciones
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('producto')
export class ProductoController {
  constructor(
    private readonly productoService: ProductoService,
    private readonly subscriptionService: SubscriptionService, // Servicio de suscripciones
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductoDto: CreateProductoDto,
  ) {
    try {
      const producto = await this.productoService.create(createProductoDto, file);
      return {
        message: 'Producto creado y notificaciones enviadas',
        producto,
      };
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw new HttpException(
        { message: 'Error al crear producto', error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productoService.findOne(parseInt(id, 10));
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const updatedProducto = await this.productoService.updateById(
        parseInt(id, 10),
        updateProductoDto,
        file,
      );
      return updatedProducto;
    } catch (error) {
      throw new HttpException(
        { message: 'Error al actualizar producto', error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.productoService.remove(parseInt(id, 10));
      return { message: `Producto con ID ${id} eliminado correctamente` };
    } catch (error) {
      throw new HttpException(
        { message: 'Error al eliminar producto', error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
