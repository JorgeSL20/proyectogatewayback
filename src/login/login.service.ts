import { Injectable } from '@nestjs/common';
import { ValidarLogin } from 'src/auth/dto/ValidLoginDto-auth';
import * as bcryptjs from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { Logs } from 'src/auth/entities/logs.entity';

@Injectable()
export class LoginService {

  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>, 
    private authService: AuthService,
    @InjectRepository(Logs) private logsRepository: Repository<Logs>
  ) { }

  async validLogin(createLoginDto: ValidarLogin): Promise<boolean> {

    const data = await this.authService.getUser(createLoginDto.email)
    console.log(createLoginDto)
    if (await bcryptjs.compare(createLoginDto.password, data.password))
      return true;
    else
      return false;
  }

  async asignarIntentos(id: number, intento: number, fechaUltimoIntento: Date) {
    await this.authRepository.update(id, { intentos: intento, fechaUltimoIntento: fechaUltimoIntento });
  }

  async resetearIntentos(id: number) {
    await this.authRepository.update(id, { intentos: 0, fechaUltimoIntento: null });
  }

  async crearLogs(data: { accion: string, ip: string, url_solicitada: string, status: number, fecha: string }, email: string) {
    const userFound = await this.authRepository.findOne({ where: { email: email } });
    if (userFound) {
      const newLog = this.logsRepository.create({ usuario: userFound, ...data });
      await this.logsRepository.save(newLog);
    }
  }
}
