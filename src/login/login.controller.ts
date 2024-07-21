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

      this.loginService.checkAndUpdateAttempts(datos);

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
    } catch (error) {
      throw new HttpException("El correo no existe", HttpStatus.FOUND);
    }
  }
}
