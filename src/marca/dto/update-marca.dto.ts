// update-marca.dto.ts
import { IsString } from 'class-validator';

export class UpdateMarcaDto {
  @IsString()
  marca: string;
}