import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcaDto } from './create-marca.dto';

export class UpdateMarcaDto extends PartialType(CreateMarcaDto) {
  @IsString()
  @IsOptional()
  marca?: string;
}
