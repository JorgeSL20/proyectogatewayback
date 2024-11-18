import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,  // Inyectamos el repositorio de Auth para obtener el usuario
  ) {}

  async createFeedback(userId: string, createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    // Convertir el userId a number
    const userIdNumber = Number(userId);

    // Validamos si la conversión fue exitosa
    if (isNaN(userIdNumber)) {
      throw new Error('ID de usuario inválido');
    }

    // Encontramos el usuario por su ID
    const user = await this.authRepository.findOne({ where: { id: userIdNumber } });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Crear el feedback asociado al usuario
    const feedback = this.feedbackRepository.create({
      rating: createFeedbackDto.rating,  // Usar la propiedad correcta de CreateFeedbackDto (en este caso `opcion`)
      usuario: user,  // Asociamos el usuario encontrado
    });

    // Guardar el feedback en la base de datos
    return this.feedbackRepository.save(feedback);
  }
}
