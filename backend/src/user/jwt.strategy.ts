import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(cfg: ConfigService) {
    // Obtén el secreto desde ConfigService o fallback a process.env
    const secret = cfg?.get<string>('JWT_SECRET') ?? process.env.JWT_SECRET;

    if (!secret) {
      // Lanzamos un error claro para evitar el típico "requires a secret or key"
      throw new InternalServerErrorException(
        'JWT_SECRET no está definido. Asegurate de tener JWT_SECRET en .env o en las variables de entorno.'
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, nombre: payload.nombre };
  }
}