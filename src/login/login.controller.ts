import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService, private userService: AuthService) {}

  @Post()
  async validLogin(@Body() createLoginDto: CreateLoginDto) {
    try {
      const datos = await this.userService.getUser(createLoginDto.email);
      if (!datos) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      const ahora = new Date();
      const fechaUltimoIntento = datos.fechaUltimoIntento ? new Date(datos.fechaUltimoIntento) : null;
      const tiempoTranscurrido = fechaUltimoIntento ? (ahora.getTime() - fechaUltimoIntento.getTime()) / 60000 : null; // En minutos

      if (datos.intentos >= 5 && (tiempoTranscurrido < 5)) {
        return {
          message: 'Número máximo de intentos alcanzado. Intenta de nuevo en 5 minutos.',
          status: HttpStatus.CONFLICT,
          nIntentos: datos.intentos
        };
      } else {
        let intento = datos.intentos;

        if (tiempoTranscurrido >= 5) { // Si han pasado 5 minutos, reinicia los intentos
          intento = 0;
        }

        if (intento >= 5) {
          await this.loginService.resetearIntentos(datos.id);
          await this.loginService.crearLogs({
            accion: 'Sesión bloqueada',
            fecha: createLoginDto.fecha,
            ip: createLoginDto.ip,
            status: 409,
            url_solicitada: '/login'
          }, datos.email);

          return {
            message: 'Número máximo de intentos alcanzado. Intenta de nuevo en 5 minutos.',
            status: HttpStatus.CONFLICT,
            nIntentos: intento
          };
        } else {
          intento++;
          await this.loginService.asignarIntentos(datos.id, intento, ahora);

          const isValidLogin = await this.loginService.validLogin(createLoginDto);
          if (isValidLogin) {
            await this.loginService.resetearIntentos(datos.id);
            await this.loginService.crearLogs({
              accion: 'Inicio de sesión',
              fecha: createLoginDto.fecha,
              ip: createLoginDto.ip,
              status: 200,
              url_solicitada: '/login'
            }, datos.email);

            return {
              message: 'Login correcto',
              status: 200,
              token: datos.id
            };
          } else {
            return {
              message: 'Login incorrecto',
              status: HttpStatus.UNAUTHORIZED
            };
          }
        }
      }
    } catch (error) {
      console.error('Error en validLogin:', error);
      return {
        message: 'Correo inválido o error del servidor',
        status: 302
      };
    }
  }
}
