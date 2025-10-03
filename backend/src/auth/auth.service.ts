import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './entities/auth.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: Model<Auth>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createAuthDto: RegisterAuthDto) {
    const { email, accessKey } = createAuthDto;

    if (!email || !accessKey) {
      throw new HttpException('Bad Request', 400);
    }

    const plainTextPassword = await bcrypt.hash(accessKey, 10);

    const existingUser = await this.authModel.findOne({ email });

    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }

    const newUser = await this.authModel.create({
      email,
      accessKey: plainTextPassword,
    });

    return newUser;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, accessKey } = loginAuthDto;

    // Buscar usuario
    const user = await this.authModel.findOne({ email });
    if (!user) {
      throw new HttpException('USER NOT FOUND', 404);
    }

    // Verificar contraseña
    const passwordValid = await bcrypt.compare(accessKey, user.accessKey);
    if (!passwordValid) {
      throw new HttpException('PASSWORD_INCORRECT', 403);
    }

    // Crear payload y token JWT
    const payload = { email: user.email, sub: user._id };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    };
  }
}
