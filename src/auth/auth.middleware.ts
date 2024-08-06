import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response, NextFunction } from 'express';
import { Auth } from './entities/auth.entity';

interface AuthenticatedRequest extends Request {
  user?: Auth;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const user = await this.authService.validateToken(token);
        req.user = user; // Agrega el usuario a la solicitud
      } catch (err) {
        console.error('Error al validar el token:', err);
      }
    }
    next();
  }
}
