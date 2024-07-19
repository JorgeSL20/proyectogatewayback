import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const user = await this.authService.validateToken(token); // Asume que esta función valida el token y devuelve el usuario
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    request.user = { id: token }; // Si el token es el userId, lo asignamos directamente
    return true;
  }
}
