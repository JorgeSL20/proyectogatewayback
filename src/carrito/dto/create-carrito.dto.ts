import { IsInt, IsNotEmpty } from 'class-validator';

export class CrearCarritoDto {
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @IsInt()
  @IsNotEmpty()
  productoId: number;

  @IsInt()
  @IsNotEmpty()
  cantidad: number;
}
