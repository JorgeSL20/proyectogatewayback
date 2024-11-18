import { IsString, IsInt, IsOptional, MaxLength, IsEmail } from 'class-validator';

export class CreateFeedbackDto {
  @IsInt()
  userId: number; // ID del usuario que deja el feedback

  @IsString()
  @MaxLength(255)
  rating: string; // El comentario o retroalimentación 
}