import { IsInt, IsPositive } from 'class-validator';

export class CrearCarritoDto {
  id: number;
  @IsInt()
  @IsPositive()
  usuarioId: number;

  @IsInt()
  @IsPositive()
  productoId: number;

  @IsInt()
  @IsPositive()
  cantidad: number;
}
