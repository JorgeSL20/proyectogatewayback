import { Injectable, HttpStatus, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { Auth, Informacion, Preguntas} from './entities/auth.entity';
import { Logs } from './entities/logs.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ValidarLogin } from './dto/ValidLoginDto-auth';
import { CreateInformacionDto } from './dto/create-informacion.dto';
import { CreatePreguntasDto } from './dto/create-preguntas.dto';
import { NotFoundException } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(Informacion)
    private informacionRepository: Repository<Informacion>,
    @InjectRepository(Preguntas)
    private preguntasRepository: Repository<Preguntas>,
    @InjectRepository(Logs)
    private logsRepository: Repository<Logs>,
  ) {}

  create(createAuthDto: CreateAuthDto) {
    const { password, ...resultado } = createAuthDto;
    const newUser = this.authRepository.create({
      password: bcryptjs.hashSync(password, 10),
      ...resultado,
    });
    return this.authRepository.save(newUser);
  }

   // Método para subir la imagen a Cloudinary en la carpeta 'user_images'
   async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'user_images' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(file.buffer);
    });
  }

  async login(user: Auth): Promise<{ token: number }> {
    return {
      token: user.id,
    };
  }

  async updateById(id: number, updateAuthDto: CreateAuthDto, file?: Express.Multer.File) {
    try {
      const foundUser = await this.authRepository.findOne({ where: { id } });
      if (!foundUser) {
        return {
          message: 'Usuario no encontrado',
          status: HttpStatus.NOT_FOUND,
        };
      }

      if (file) {
        // Si se proporciona un archivo, sube la imagen
        const result = await this.uploadImage(file);
        updateAuthDto.url = result.secure_url; // Actualiza la URL de la imagen en el DTO
      }

      // Actualiza los datos del usuario
      await this.authRepository.update(id, updateAuthDto);

      return {
        message: 'Usuario actualizado correctamente',
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Error en updateById:', error);
      throw new InternalServerErrorException('Error al actualizar usuario');
    }
  }

  async updatePassword(email: string, data: { password: string; ip: string; fecha: string }) {
    const foundUser = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }
    foundUser.password = bcryptjs.hashSync(data.password, 10);
    const updatedUser = await this.authRepository.save(foundUser);
    const newLog = this.logsRepository.create({
      accion: 'Cambio de contraseña',
      ip: data.ip,
      url: 'auth/password/:email',
      status: 200,
      fecha: data.fecha,
      usuario: foundUser,
    });
    await this.logsRepository.save(newLog);
    return updatedUser;
  }

  async update(email: string, updateAuthDto: CreateAuthDto) {
    const { password, ...data } = updateAuthDto;
    const foundUser = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });
    if (password) {
      const updateUser = this.authRepository.update(foundUser.id, {
        password: bcryptjs.hashSync(password, 10),
        ...data,
      });
      return updateUser;
    } else {
      const updateUser = this.authRepository.update(foundUser.id, updateAuthDto);
      return updateUser;
    }
  }

  async validLogin(createLoginDto: ValidarLogin): Promise<boolean> {
    try {
      const data = await this.getUser(createLoginDto.email);
      if (!data) {
        return false; // El correo no es válido
      }
      const isPasswordValid = await bcryptjs.compare(createLoginDto.password, data.password);
      return isPasswordValid;
    } catch (error) {
      console.error('Error en validLogin:', error);
      throw new Error('Error en el servidor');
    }
  }

  async getUser(email: string) {
    try {
      const user = await this.authRepository.findOne({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      console.error('Error en getUser:', error);
      throw new Error('Error en el servidor');
    }
  }

  async getUserById(id: string) {
    const userFound = await this.authRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });
    return {
      name: userFound.name,
      lastNameP: userFound.lastNameP,
      lastNameM: userFound.lastNameM,
      email: userFound.email,
      pregunta: userFound.pregunta,
      respuesta: userFound.respuesta,
    };
  }

  async getInformacionById(id: string) {
    const informacionFound = await this.informacionRepository.findOne({
      where: {
        id_informacion: parseInt(id),
      },
    });
    return {
      mision: informacionFound.mision,
      vision: informacionFound.vision,
      quienessomos: informacionFound.quienessomos,
    };
  }

  async updateInformacionById(id: string, updateInformacionDto: CreateInformacionDto) {
    const informacionToUpdate = await this.informacionRepository.findOne({
      where: {
        id_informacion: parseInt(id),
      },
    });

    if (!informacionToUpdate) {
      return {
        message: 'La información no fue encontrada',
        status: HttpStatus.NOT_FOUND,
      };
    }

    const updatedInformacion = await this.informacionRepository.merge(informacionToUpdate, updateInformacionDto);
    await this.informacionRepository.save(updatedInformacion);

    return {
      message: 'Información actualizada correctamente',
      status: HttpStatus.OK,
    };
  }

  async getPreguntas() {
    const preguntasFound = await this.preguntasRepository.find();
    return preguntasFound;
  }

  async updatePreguntasById(id: string, updatePreguntasDto: CreatePreguntasDto) {
    const preguntasToUpdate = await this.preguntasRepository.findOne({
      where: {
        id_preguntas: parseInt(id),
      },
    });

    if (!preguntasToUpdate) {
      return {
        message: 'La pregunta no fue encontrada',
        status: HttpStatus.NOT_FOUND,
      };
    }

    const updatedPreguntas = await this.preguntasRepository.merge(preguntasToUpdate, updatePreguntasDto);
    await this.preguntasRepository.save(updatedPreguntas);

    return {
      message: 'Pregunta actualizada correctamente',
      status: HttpStatus.OK,
    };
  }

  async createPreguntas(createPreguntasDto: CreatePreguntasDto) {
    const nuevaPregunta = this.preguntasRepository.create(createPreguntasDto);
    await this.preguntasRepository.save(nuevaPregunta);
    return {
      message: 'Pregunta creada correctamente',
      status: HttpStatus.CREATED,
    };
  }

  async deletePregunta(id: number) {
    const preguntaExistente = await this.preguntasRepository.findOne({ where: { id_preguntas: id } });
    if (!preguntaExistente) {
      return {
        message: 'La pregunta no fue encontrada',
        status: HttpStatus.NOT_FOUND,
      };
    }
    await this.preguntasRepository.remove(preguntaExistente);
    return {
      message: 'Pregunta eliminada correctamente',
      status: HttpStatus.OK,
    };
  }

  async getAuth() {
    const authFound = await this.authRepository.find();
    return authFound;
  }

  async deleteUser(email: string) {
    const userToDelete = await this.authRepository.findOne({ where: { email } });
    if (!userToDelete) {
      throw new Error('Usuario no encontrado');
    }
    await this.authRepository.remove(userToDelete);
    return { message: 'Usuario eliminado correctamente' };
  }

  async crearLogs(data: { accion: string; ip: string; url: string; status: number; fecha: string }, email: string) {
    try {
        const userFound = await this.authRepository.findOne({
            where: {
                email: email,
            },
        });

        if (!userFound) {
            throw new Error('Usuario no encontrado para crear el log');
        }

        const newLog = this.logsRepository.create({
            usuario: userFound,
            ...data,
        });

        await this.logsRepository.save(newLog);
    } catch (error) {
        console.error('Error en crearLogs:', error);
        console.error('Full error stack:', error);
        throw new Error('Error al crear el log');
    }
}

async validateToken(token: string): Promise<Auth | null> {
  const userId = parseInt(token, 10);
  if (isNaN(userId)) {
    return null;
  }
  const user = await this.authRepository.findOne({ where: { id: userId } });
  if (!user) {
    return null;
  }
  return user;
}

  async asignarIntentos(id: number, intento: number) {
    const user = await this.authRepository.findOne({ where: { id } });
    if (user) {
      user.intentos = intento;
      await this.authRepository.save(user);
    }
  }

  async resetearIntentos(id: number) {
    setTimeout(async () => {
      const user = await this.authRepository.findOne({ where: { id } });
      if (user) {
        user.intentos = 0;
        await this.authRepository.save(user);
        console.log('Intentos reseteados');
      }
    }, 300000);
  }

  async remove(id: number) {
    const userToDelete = await this.authRepository.findOne({ where: { id } });
    if (!userToDelete) {
      throw new Error('Usuario no encontrado');
    }
    await this.authRepository.remove(userToDelete);
    return { message: 'Usuario eliminado correctamente' };
  }

  async findAll() {
    return this.authRepository.find();
  }

  async findOne(id: string) {
    return this.authRepository.findOne({ where: { id: parseInt(id) } });
  }

  async updateRoleByEmail(email: string, newRole: string) {
    const user = await this.authRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    user.role = newRole;
    return this.authRepository.save(user);
  }
}
