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
      if (datos === null) throw new Error("error");

      await this.loginService.resetearIntentos(datos.id); // Intentar resetear antes de incrementar intentos

      if (datos.intentos >= 5) {
        return {
          message: 'Número máximo de intentos alcanzado',
          status: HttpStatus.CONFLICT,
          nIntentos: datos.intentos
        };
      } else {
        datos.intentos++;
        await this.loginService.asignarIntentos(datos.id, datos.intentos);

        if (datos.intentos >= 5) {
          await this.loginService.crearLogs({
            accion: 'Sesión bloqueada',
            fecha: createLoginDto.fecha,
            ip: createLoginDto.ip,
            status: 409,
            url_solicitada: '/login'
          }, datos.email);
          return {
            message: 'Número máximo de intentos alcanzado',
            status: HttpStatus.CONFLICT,
            nIntentos: datos.intentos
          };
        } else {
          const loginSuccessful = await this.loginService.validLogin(createLoginDto);
          if (loginSuccessful) {
            await this.loginService.asignarIntentos(datos.id, 0); // Resetear intentos en login exitoso
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
              status: 400
            };
          }
        }
      }
    } catch (error) {
      return {
        message: 'Correo inválido',
        status: 302
      };
    }
  }
}
