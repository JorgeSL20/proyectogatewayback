// update-categoria.dto.ts
import { IsString } from 'class-validator';

export class UpdateCategoriaDto {
  @IsString()
  categoria: string;
}
