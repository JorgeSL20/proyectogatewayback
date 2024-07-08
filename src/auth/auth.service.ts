import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto} from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth,Informacion, Preguntas } from './entities/auth.entity';
import * as bcryptjs from 'bcryptjs';
import { ValidarLogin } from './dto/ValidLoginDto-auth';
import { CreateCitasDto } from './dto/create-cita.dto';
import { CreateInformacionDto } from './dto/create-informacion.dto';
import { CreatePreguntasDto } from './dto/create-preguntas.dto';
import { Logs } from './entities/logs.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(Informacion)
    private informacionRepository: Repository<Informacion>,
    @InjectRepository(Preguntas)
    private preguntasRepository: Repository<Preguntas>,
    @InjectRepository(Logs) // Inyecta el repositorio de Logs
    private logsRepository: Repository<Logs>
  ) {}

  create(createAuthDto: CreateAuthDto) {
    const {password,...resultado}=createAuthDto
    const newuser = this.authRepository.create({
      password: bcryptjs.hashSync(password,10),
      ...resultado
    })
    return this.authRepository.save(newuser)
  }
  ///
  async updateById(id:number,updateAuthDto: CreateAuthDto){
    const foundUser = await this.authRepository.findOne({
      where:{
        id:id
      }
    })
    const {ip,fecha_log,...data} = updateAuthDto
    this.authRepository.update(id,data)

    this.crearLogs({
      accion:'Se actualizo la iformacion del usuario',
      fecha:fecha_log,
      ip:ip,
      status:200,
      url:'auth/perfil/:id',
    },foundUser.email)
      return {
        message: 'Usuario actualizado correctamente',
        status:HttpStatus.OK
      }
  }
////
async updatePassword(email: string, data: { password: string, ip: string, fecha: string }) {
  const foundUser = await this.authRepository.findOne({
    where: {
      email: email
    }
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
    usuario: foundUser 
  });
  await this.logsRepository.save(newLog);
  return updatedUser;
}



async update(email: string, updateAuthDto: CreateAuthDto) {
  const {password,...data} = updateAuthDto;
  const foundUser = await this.authRepository.findOne({
    where:{
      email:email
    }
  })
  if(password){
    const updateuser= this.authRepository.update(foundUser.id,{
      password:bcryptjs.hashSync(password,10),
      ...data
    })
    return updateuser
  }
  else{
    const updateuser= this.authRepository.update(foundUser.id,updateAuthDto)
    return updateuser
  }
  
}


async validLogin(createLoginDto: ValidarLogin):Promise<boolean> {

  const data = this.getUser(createLoginDto.email)

  if(await bcryptjs.compare(createLoginDto.password, (await data).password))
    return true;
  else
    return false; 
}

findAll() {
  return this.authRepository.find();
}

findOne(id: string) {
  return this.authRepository.findOne({
    where: { email: id },
  });
}
remove(id: number) {
  return this.authRepository.delete({
    id: id
  })
}
getUser(email: string) {
  const user = this.authRepository.findOne({
    where: {
      email: email
    }
  });
  return user;
}
///


  async getUserById(id:string){
    const userFound = await this.authRepository.findOne({
      where:{
        id:parseInt(id)
      }
    });
    return{
      name: userFound.name,
      lastNameP: userFound.lastNameP,
      lastNameM: userFound.lastNameM,
      email: userFound.email,
      pregunta:userFound.pregunta,
      respuesta:userFound.respuesta
    }
  }

  
///informacion
async getInformacionById(id:string){
  const informacionFound = await this.informacionRepository.findOne({
    where:{
      id_informacion:parseInt(id)
    }
  });
  return {
    mision: informacionFound.mision,
    vision: informacionFound.vision,
    quienessomos: informacionFound.quienessomos,
  };
}
////

async updateInformacionById(id: string, updateInformacionDto: CreateInformacionDto) {
  const informacionToUpdate = await this.informacionRepository.findOne({
    where: {
      id_informacion: parseInt(id)
    }
  });

  if (!informacionToUpdate) {
    // Manejar el caso en que no se encuentra la información con el ID proporcionado
    return {
      message: 'La información no fue encontrada',
      status: HttpStatus.NOT_FOUND
    };
  }

  const updatedInformacion = await this.informacionRepository.merge(informacionToUpdate, updateInformacionDto);
  await this.informacionRepository.save(updatedInformacion);

  return {
    message: 'Información actualizada correctamente',
    status: HttpStatus.OK
  };
}


///preguntas
async getPreguntas(){
  const preguntasFound = await this.preguntasRepository.find()
  return preguntasFound
}
////
async updatePreguntasById(id: string, updatePreguntasDto: CreatePreguntasDto) {
  const preguntasToUpdate = await this.preguntasRepository.findOne({
    where: {
      id_preguntas: parseInt(id)
    }
  });

  if (!preguntasToUpdate) {
    // Manejar el caso en que no se encuentra la pregunta con el ID proporcionado
    return {
      message: 'La pregunta no fue encontrada',
      status: HttpStatus.NOT_FOUND
    };
  }

  const updatedPreguntas = await this.preguntasRepository.merge(preguntasToUpdate, updatePreguntasDto);
  await this.preguntasRepository.save(updatedPreguntas);

  return {
    message: 'Pregunta actualizada correctamente',
    status: HttpStatus.OK
  };
}
/////
async createPreguntas(createPreguntasDto: CreatePreguntasDto) {
  const nuevaPregunta = this.preguntasRepository.create(createPreguntasDto);
  await this.preguntasRepository.save(nuevaPregunta);
  return {
    message: 'Pregunta creada correctamente',
    status: HttpStatus.CREATED
  };
}
/////
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
////////usuarios
async getAuth(){
  const AuthFound = await this.authRepository.find()
  return AuthFound
}

async deleteUser(email: string) {
  const userToDelete = await this.authRepository.findOne({ where: { email } });
  if (!userToDelete) {
    throw new Error('Usuario no encontrado');
  }
  await this.authRepository.remove(userToDelete);
  return { message: 'Usuario eliminado correctamente' };
}

async crearLogs(data:{accion:string,ip:string,url:string,status:number,fecha:string},email:string){
  const userFound =  await this.authRepository.findOne({
    where: {
      email: email
    }
  })
  const newLog = this.logsRepository.create({
    usuario:userFound,
    ...data
  })
  this.logsRepository.save(newLog)
}
}
