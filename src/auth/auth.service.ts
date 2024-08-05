// auth.service.ts

import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { Auth, Informacion, Preguntas } from './entities/auth.entity';
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
      role: createAuthDto.role || 'user', // Set role to 'user' if not provided
    });
    return this.authRepository.save(newUser);
  }

  async login(user: Auth): Promise<{ token: number }> {
    return { token: user.id };
  }

  async updateById(id: number, updateAuthDto: CreateAuthDto) {
    const foundUser = await this.authRepository.findOne({ where: { id } });
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
    const foundUser = await this.authRepository.findOne({ where: { email } });
    if (!foundUser) throw new Error('Usuario no encontrado');
    foundUser.password = bcryptjs.hashSync(data.password, 10);
    await this.authRepository.save(foundUser);
    await this.crearLogs(
      {
        accion: 'Cambio de contraseña',
        ip: data.ip,
        url: 'auth/password/:email',
        status: 200,
        fecha: data.fecha,
      },
      foundUser.email,
    );
    return { message: 'Contraseña actualizada correctamente' };
  }

  async update(email: string, updateAuthDto: CreateAuthDto) {
    const foundUser = await this.authRepository.findOne({ where: { email } });
    if (!foundUser) throw new Error('Usuario no encontrado');
    const { password, ...data } = updateAuthDto;
    if (password) {
      await this.authRepository.update(foundUser.id, {
        password: bcryptjs.hashSync(password, 10),
        ...data,
      });
    } else {
      await this.authRepository.update(foundUser.id, updateAuthDto);
    }
    return { message: 'Usuario actualizado correctamente' };
  }

  async validLogin(createLoginDto: ValidarLogin): Promise<boolean> {
    try {
      const data = await this.getUser(createLoginDto.email);
      if (!data) return false;
      const isPasswordValid = await bcryptjs.compare(createLoginDto.password, data.password);
      return isPasswordValid;
    } catch (error) {
      console.error('Error en validLogin:', error);
      throw new Error('Error en el servidor');
    }
  }

  async getUser(email: string) {
    try {
      console.log(`Buscando usuario con email: ${email}`);
      const user = await this.authRepository.findOne({ where: { email } });
      if (!user) {
        console.error(`Usuario no encontrado para el email: ${email}`);
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error en getUser:', error);
      throw new Error('Error en el servidor');
    }
  }

  async getUserById(id: string) {
    try {
      const userFound = await this.authRepository.findOne({ where: { id: parseInt(id) } });
      if (!userFound) throw new Error('Usuario no encontrado');
      return {
        name: userFound.name,
        lastNameP: userFound.lastNameP,
        lastNameM: userFound.lastNameM,
        email: userFound.email,
        pregunta: userFound.pregunta,
        respuesta: userFound.respuesta,
      };
    } catch (error) {
      console.error('Error en getUserById:', error);
      throw new Error('Error en el servidor');
    }
  }

  async getInformacionById(id: string) {
    try {
      const informacionFound = await this.informacionRepository.findOne({
        where: { id_informacion: parseInt(id) },
      });
      if (!informacionFound) throw new Error('Información no encontrada');
      return {
        mision: informacionFound.mision,
        vision: informacionFound.vision,
        quienessomos: informacionFound.quienessomos,
      };
    } catch (error) {
      console.error('Error en getInformacionById:', error);
      throw new Error('Error en el servidor');
    }
  }

  async updateInformacionById(id: string, updateInformacionDto: CreateInformacionDto) {
    try {
      const informacionToUpdate = await this.informacionRepository.findOne({
        where: { id_informacion: parseInt(id) },
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
    } catch (error) {
      console.error('Error en updateInformacionById:', error);
      throw new Error('Error en el servidor');
    }
  }

  async getPreguntas() {
    try {
      return await this.preguntasRepository.find();
    } catch (error) {
      console.error('Error en getPreguntas:', error);
      throw new Error('Error en el servidor');
    }
  }

  async updatePreguntasById(id: string, updatePreguntasDto: CreatePreguntasDto) {
    try {
      const preguntasToUpdate = await this.preguntasRepository.findOne({
        where: { id_preguntas: parseInt(id) },
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
    } catch (error) {
      console.error('Error en updatePreguntasById:', error);
      throw new Error('Error en el servidor');
    }
  }

  async createPreguntas(createPreguntasDto: CreatePreguntasDto) {
    try {
      const nuevaPregunta = this.preguntasRepository.create(createPreguntasDto);
      await this.preguntasRepository.save(nuevaPregunta);
      return {
        message: 'Pregunta creada correctamente',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.error('Error en createPreguntas:', error);
      throw new Error('Error en el servidor');
    }
  }

  async deletePregunta(id: number) {
    try {
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
    } catch (error) {
      console.error('Error en deletePregunta:', error);
      throw new Error('Error en el servidor');
    }
  }

  async getAuth() {
    try {
      return await this.authRepository.find();
    } catch (error) {
      console.error('Error en getAuth:', error);
      throw new Error('Error en el servidor');
    }
  }

  async deleteUser(email: string) {
    try {
      const userToDelete = await this.authRepository.findOne({ where: { email } });
      if (!userToDelete) throw new Error('Usuario no encontrado');
      await this.authRepository.remove(userToDelete);
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      console.error('Error en deleteUser:', error);
      throw new Error('Error en el servidor');
    }
  }

  async crearLogs(data: { accion: string; ip: string; url: string; status: number; fecha: string }, email: string) {
    const user = await this.authRepository.findOne({ where: { email } });
    const logs = this.logsRepository.create({ ...data, usuario: user });
    return this.logsRepository.save(logs);
  }


  async validateToken(token: string): Promise<Auth | null> {
    try {
      const userId = parseInt(token, 10);
      if (isNaN(userId)) return null;
      return await this.authRepository.findOne({ where: { id: userId } });
    } catch (error) {
      console.error('Error en validateToken:', error);
      throw new Error('Error en el servidor');
    }
  }

  async asignarIntentos(id: number, intento: number) {
    try {
      const user = await this.authRepository.findOne({ where: { id } });
      if (user) {
        user.intentos = intento;
        await this.authRepository.save(user);
      }
    } catch (error) {
      console.error('Error en asignarIntentos:', error);
      throw new Error('Error en el servidor');
    }
  }

  async resetearIntentos(id: number) {
    setTimeout(async () => {
      try {
        const user = await this.authRepository.findOne({ where: { id } });
        if (user) {
          user.intentos = 0;
          await this.authRepository.save(user);
          console.log('Intentos reseteados');
        }
      } catch (error) {
        console.error('Error en resetearIntentos:', error);
        throw new Error('Error en el servidor');
      }
    }, 300000);
  }

  async remove(id: number) {
    try {
      const userToDelete = await this.authRepository.findOne({ where: { id } });
      if (!userToDelete) throw new Error('Usuario no encontrado');
      await this.authRepository.remove(userToDelete);
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      console.error('Error en remove:', error);
      throw new Error('Error en el servidor');
    }
  }

  async findAll() {
    try {
      return await this.authRepository.find();
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new Error('Error en el servidor');
    }
  }

  async findOne(id: string) {
    try {
      return await this.authRepository.findOne({ where: { id: parseInt(id) } });
    } catch (error) {
      console.error('Error en findOne:', error);
      throw new Error('Error en el servidor');
    }
  }

  async getUserByEmail(email: string): Promise<Auth> {
    return await this.authRepository.findOne({ where: { email } });
  }
}
