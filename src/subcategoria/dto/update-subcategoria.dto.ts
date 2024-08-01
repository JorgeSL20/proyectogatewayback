// update-categoria.dto.ts
import { IsString } from 'class-validator';

export class UpdateSubcategoriaDto {
  @IsString()
  categoria: string;
  
  @IsString()
  subcategoria: string;
}
