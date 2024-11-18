import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createFeedback(
    @Body('token') token: string,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ) {
    try {
      // Validar el token
      const user = await this.authService.validateToken(token);
      if (!user) {
        throw new HttpException(
          'Token inválido o usuario no encontrado',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Crear el feedback asociado al usuario
      const feedback = await this.feedbackService.createFeedback(
        user.id.toString(),  // Asegúrate de pasar user.id como string si es necesario
        createFeedbackDto,   // Pasa el DTO correctamente
      );

      return {
        message: 'Feedback creado exitosamente',
        feedback,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message || 'Error al crear el feedback',
          error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        // Si el error no es una instancia de Error, se maneja de forma genérica
        throw new HttpException(
          'Error desconocido al crear el feedback',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
