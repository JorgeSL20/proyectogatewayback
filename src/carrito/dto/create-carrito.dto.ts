// src/carrito/dto/create-carrito-item.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CrearCarritoDto {
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @IsNumber()
  @IsNotEmpty()
  productoId: number;

  @IsString()
  @IsNotEmpty()
  productoNombre: string;

  @IsString()
  @IsNotEmpty()
  productoImagen: string;

  @IsNumber()
  @IsNotEmpty()
  productoPrecioMen: number;

  @IsNumber()
  @IsNotEmpty()
  productoPrecioMay: number;

  @IsNumber()
  @IsNotEmpty()
  productoCantidadMay: number;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;
}
