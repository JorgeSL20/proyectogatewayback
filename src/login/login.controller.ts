import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private userService: AuthService
  ) {}

  intento: number = 0;

  @Post()
  async validLogin(@Body() createLoginDto: CreateLoginDto) {
    console.log(createLoginDto.password);
    try {
      console.log("entra");
      const datos = await this.userService.getUser(createLoginDto.email);
      console.log(datos);
      if (datos === null) {
        return {
          message: 'Correo inválido',
          status: HttpStatus.FOUND,
        };
      }

      this.intento = datos.intentos;
      if (this.intento >= 5) {
        return {
          message: 'Número máximo de intentos alcanzado',
          status: HttpStatus.CONFLICT,
          nIntentos: this.intento,
        };
      } else {
        this.intento++;
        await this.loginService.asignarIntentos(datos.id, this.intento);
        if (this.intento >= 5) {
          console.log("la de abajo");
          await this.loginService.resetearIntentos(datos.id);
          await this.loginService.crearLogs(
            {
              accion: 'Sesión bloqueada',
              fecha: createLoginDto.fecha,
              ip: createLoginDto.ip,
              status: 409,
              url_solicitada: '/login',
            },
            datos.email
          );
          return {
            message: 'Número máximo de intentos alcanzado',
            status: HttpStatus.CONFLICT,
            nIntentos: this.intento,
          };
        } else {
          const data = await this.loginService.validLogin(createLoginDto);
          if (data === true) {
            await this.loginService.resetearIntentos(datos.id);
            await this.loginService.crearLogs(
              {
                accion: 'Inicio de sesión',
                fecha: createLoginDto.fecha,
                ip: createLoginDto.ip,
                status: 200,
                url_solicitada: '/login',
              },
              datos.email
            );
            return {
              message: 'Login correcto',
              status: HttpStatus.OK,
              token: datos.id,
            };
          } else {
            return {
              message: 'Contraseña incorrecta',
              status: HttpStatus.BAD_REQUEST,
            };
          }
        }
      }
    } catch (error) {
      console.error(error);
      return {
        message: 'Error en el servidor',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
