// producto.controller.ts
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
import { SubscriptionService } from 'src/Subcripcion/subscription.service';  // Asegúrate de que la ruta sea correcta
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('producto')
export class ProductoController {
  constructor(
    private readonly productoService: ProductoService,
    private readonly subscriptionService: SubscriptionService, // Asegúrate de que SubscriptionService esté aquí
  ) {}

  @Post()
@UseInterceptors(FileInterceptor('file'))
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body() createProductoDto: CreateProductoDto,
) {
  try {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Subir imagen y obtener URL
    const result = await this.productoService.uploadImage(file);
    createProductoDto.url = result.secure_url;
    console.log('Imagen subida con éxito', result.secure_url);

    // Crear producto en base de datos
    const nuevoProducto = await this.productoService.create(createProductoDto);
    console.log('Producto creado con éxito', nuevoProducto);

    // Crear payload de notificación
    const payload = {
      title: '¡Nuevo producto disponible!',
      body: `El producto "${nuevoProducto.producto}" ya está disponible.`,
      icon: 'https://res.cloudinary.com/dkwb9vcbb/image/upload/v1734053100/user_images/imagen_logo_n3b16q.jpg ',
      url: `https://proyectogatewayback-production.up.railway.app/producto/${nuevoProducto.id}`,
    };

    // Verificar suscripciones activas
    const subscriptions = await this.subscriptionService.getSubscriptions();
    console.log(`Número de suscripciones activas: ${subscriptions.length}`);

    if (subscriptions.length === 0) {
      console.warn('No hay suscripciones activas para enviar notificaciones.');
      return {
        message: 'Producto creado, pero no hay suscripciones activas para notificaciones.',
        producto: nuevoProducto,
      };
    }

    // Enviar notificaciones push
    await this.subscriptionService.sendNotification(payload); // Llamamos al servicio de suscripciones
    console.log('Notificación enviada con éxito');

    return {
      message: 'Producto creado exitosamente y notificaciones enviadas',
      producto: nuevoProducto,
    };
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw new HttpException(
      { message: 'Error al crear producto', error: error },
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
    const parsedId = parseInt(id, 10);
    return this.productoService.findOne(parsedId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const parsedId = parseInt(id, 10);

      if (file) {
        // Subir nueva imagen si se proporciona
        const result = await this.productoService.uploadImage(file);
        updateProductoDto.url = result.secure_url;
      }

      return this.productoService.updateById(parsedId, updateProductoDto);
    } catch (error) {
      throw new HttpException(
        { message: 'Error al actualizar producto', error: error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const parsedId = parseInt(id, 10);
      await this.productoService.remove(parsedId);
      return { message: `Producto con ID ${id} eliminado correctamente` };
    } catch (error) {
      throw new HttpException(
        { message: 'Error al eliminar producto', error: error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
