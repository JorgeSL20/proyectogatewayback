import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUbicacionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  link: string;
}
