import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { Auth, Informacion, Preguntas} from './entities/auth.entity';
import { Logs } from './entities/logs.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ValidarLogin } from './dto/ValidLoginDto-auth';
import { CreateInformacionDto } from './dto/create-informacion.dto';
import { CreatePreguntasDto } from './dto/create-preguntas.dto';

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

  async login(user: Auth): Promise<{ token: number }> {
    return {
      token: user.id,
    };
  }

  async updateById(id: number, updateAuthDto: CreateAuthDto) {
    const foundUser = await this.authRepository.findOne({
      where: {
        id: id,
      },
    });
    const { ip, fecha_log, ...data } = updateAuthDto;
    await this.authRepository.update(id, data);

    await this.crearLogs(
      {
        accion: 'Se actualizó la información del usuario',
        fecha: fecha_log,
        ip: ip,
        status: 200,
        url: 'auth/perfil/:id',
      },
      foundUser.email,
    );
    return {
      message: 'Usuario actualizado correctamente',
      status: HttpStatus.OK,
    };
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
    const userFound = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });
    const newLog = this.logsRepository.create({
      usuario: userFound,
      ...data,
    });
    await this.logsRepository.save(newLog);
  }

  async validateToken(token: string): Promise<Auth | null> {
    const userId = parseInt(token, 10);
    if (isNaN(userId)) {
      return null;
    }
    return this.authRepository.findOne({ where: { id: userId } });
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
}
