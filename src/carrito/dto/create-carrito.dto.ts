import { IsInt, IsNotEmpty } from 'class-validator';

export class CrearCarritoDto {
  @IsInt()
  @IsNotEmpty()
  productoId: number;

  @IsInt()
  @IsNotEmpty()
  cantidad: number;
}
