import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

    const isPasswordValid = await bcryptjs.compare(createLoginDto.password, data.password);
    return isPasswordValid;
  }

  async asignarIntentos(id: number, intento: number) {
    await this.authRepository.update(id, { intentos: intento });
  }

  async resetearIntentos(id: number) {
    // Resetea los intentos después de 5 minutos
    setTimeout(async () => {
      await this.authRepository.update(id, { intentos: 0 });
      console.log("Intentos reseteados");
    }, 300000); // 300000 ms = 5 minutos
  }

  async checkAndUpdateAttempts(datos: any) {
    const ahora = new Date();
    const fechaUltimoIntento = datos.fechaUltimoIntento ? new Date(datos.fechaUltimoIntento) : null;
    const tiempoTranscurrido = fechaUltimoIntento ? (ahora.getTime() - fechaUltimoIntento.getTime()) / 60000 : null; // En minutos

    if (datos.intentos >= 5 && (tiempoTranscurrido < 5)) {
      throw new HttpException('Número máximo de intentos alcanzado. Intenta de nuevo en 5 minutos.', HttpStatus.CONFLICT);
    } else {
      let intento = datos.intentos;

      if (tiempoTranscurrido >= 5) { // Si han pasado 5 minutos, reinicia los intentos
        intento = 0;
      }

      if (intento >= 5) {
        await this.resetearIntentos(datos.id);
        await this.crearLogs({
          accion: 'Sesión bloqueada',
          fecha: new Date().toISOString(),
          ip: '', // Puedes ajustar esto para registrar la IP real
          status: 409,
          url_solicitada: '/login'
        }, datos.email);

        throw new HttpException('Número máximo de intentos alcanzado. Intenta de nuevo en 5 minutos.', HttpStatus.CONFLICT);
      } else {
        intento++;
        await this.asignarIntentos(datos.id, intento);
      }
    }
  }

  async crearLogs(data: { accion: string, ip: string, url_solicitada: string, status: number, fecha: string }, email: string) {
    const userFound = await this.authRepository.findOne({ where: { email: email } });
    if (userFound) {
      const newLog = this.logsRepository.create({ usuario: userFound, ...data });
      await this.logsRepository.save(newLog);
    }
  }
}
