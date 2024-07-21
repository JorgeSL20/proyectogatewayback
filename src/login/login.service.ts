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
    const data = await this.authService.getUser(createLoginDto.email);
    if (!data) {
      return false;
    }

    // Check if the number of attempts is greater than or equal to 5
    if (data.intentos >= 5) {
      // If the attempts have reached the limit, set a timer to reset the attempts after 5 minutes
      this.resetearIntentos(data.id);
      throw new Error('Número máximo de intentos alcanzado. Intenta de nuevo en 5 minutos.');
    }

    const isPasswordValid = await bcryptjs.compare(createLoginDto.password, data.password);
    if (isPasswordValid) {
      // Reset attempts on successful login
      await this.resetearIntentos(data.id);
      return true;
    } else {
      // Increment attempts on unsuccessful login
      await this.asignarIntentos(data.id, data.intentos + 1);
      return false;
    }
  }

  asignarIntentos(id: number, intento: number) {
    this.authRepository.query(
      "UPDATE usuarios SET intentos = " + intento + " WHERE id = " + id + ""
    );
  }

  resetearIntentos(id: number) {
    console.log("conteo iniciado");
    setTimeout(() => {
      this.authRepository.query(
        "UPDATE usuarios SET intentos = 0 WHERE id = " + id + ""
      );
      console.log("Intentos reseteados");
    }, 300000); // 5 minutos = 300000 ms
  }

  async crearLogs(data: { accion: string, ip: string, url_solicitada: string, status: number, fecha: string }, email: string) {
    const userFound = await this.authRepository.findOne({
      where: {
        email: email
      }
    });
    const newLog = this.logsRepository.create({
      usuario: userFound,
      ...data
    });
    this.logsRepository.save(newLog);
  }
}
