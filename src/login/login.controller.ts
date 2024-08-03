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
    try {
      const datos = await this.userService.getUser(createLoginDto.email);
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
        await this.userService.asignarIntentos(datos.id, this.intento);
        if (this.intento >= 5) {
          await this.userService.resetearIntentos(datos.id);
          await this.userService.crearLogs(
            {
              accion: 'Sesión bloqueada',
              fecha: createLoginDto.fecha,
              ip: createLoginDto.ip,
              status: 409,
              url: '/login',
            },
            datos.email
          );
          return {
            message: 'Número máximo de intentos alcanzado',
            status: HttpStatus.CONFLICT,
            nIntentos: this.intento,
          };
        } else {
          const isValidLogin = await this.userService.validLogin(createLoginDto);
          if (isValidLogin) {
            await this.userService.resetearIntentos(datos.id);
            await this.userService.crearLogs(
              {
                accion: 'Inicio de sesión',
                fecha: createLoginDto.fecha,
                ip: createLoginDto.ip,
                status: 200,
                url: '/login',
              },
              datos.email
            );
            return {
              message: 'Login correcto',
              status: HttpStatus.OK,
              token: datos.id,
              role: datos.role,  // Asumiendo que 'role' es una propiedad del usuario
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
      console.error('Error en validLogin:', error);
      return {
        message: 'Error en el servidor',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
