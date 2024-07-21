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
      if (!datos) throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);

      let intento = datos.intentos;

      if (intento >= 5) {  
        return {
          message: 'Número máximo de intentos alcanzado',
          status: HttpStatus.CONFLICT,
          nIntentos: intento
        };
      } else {
        intento++;
        await this.loginService.asignarIntentos(datos.id, intento);
        
        if (intento >= 5) {
          await this.loginService.resetearIntentos(datos.id);
          await this.loginService.crearLogs({
            accion: 'Sesión bloqueada',
            fecha: createLoginDto.fecha,
            ip: createLoginDto.ip,
            status: 409,
            url: '/login'
          }, datos.email);

          return {
            message: 'Número máximo de intentos alcanzado',
            status: HttpStatus.CONFLICT,
            nIntentos: intento
          };
        } else {
          const isValidLogin = await this.loginService.validLogin(createLoginDto);
          if (isValidLogin) {
            await this.loginService.resetearIntentos(datos.id);
            await this.loginService.crearLogs({
              accion: 'Inicio de sesión',
              fecha: createLoginDto.fecha,
              ip: createLoginDto.ip,
              status: 200,
              url: '/login'
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
      throw new HttpException('Error en el proceso de login', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
