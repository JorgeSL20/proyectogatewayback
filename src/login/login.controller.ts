import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly authService: AuthService
  ) {}

  intento: number = 0;

  @Post()
  async validLogin(@Body() createLoginDto: CreateLoginDto) {
    try {
      const datos = await this.authService.getUser(createLoginDto.email);
      if (datos === null) throw new Error('error');

      this.intento = datos.intentos;
      if (this.intento === 5) {
        return {
          message: 'Número máximo de intentos alcanzado',
          status: HttpStatus.CONFLICT,
          nIntentos: this.intento,
        };
      } else {
        this.intento++;
        this.loginService.asignarIntentos(datos.id, this.intento);
        if (this.intento >= 5) {
          this.loginService.resetearIntentos(datos.id);
          this.loginService.crearLogs({
            accion: 'Sesión bloqueada',
            fecha: createLoginDto.fecha,
            ip: createLoginDto.ip,
            status: 409,
            url: '/login',
          }, datos.email);
          return {
            message: 'Número máximo de intentos',
            status: HttpStatus.CONFLICT,
            nIntentos: this.intento,
          };
        } else {
          const isValidLogin = await this.loginService.validLogin(createLoginDto);
          if (isValidLogin) {
            this.loginService.resetearIntentos(datos.id);
            this.loginService.crearLogs({
              accion: 'Inicio de sesión',
              fecha: createLoginDto.fecha,
              ip: createLoginDto.ip,
              status: 200,
              url: '/login',
            }, datos.email);

            // Usa el ID del usuario como el token
            const token = await this.authService.login(datos);
            return {
              message: 'Login correcto',
              status: HttpStatus.OK,
              ...token,
            };
          } else {
            return {
              message: 'Login incorrecto',
              status: HttpStatus.BAD_REQUEST,
            };
          }
        }
      }
    } catch (error) {
      return {
        message: 'Correo inválido',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
