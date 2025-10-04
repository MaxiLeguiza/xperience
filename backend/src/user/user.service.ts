import {
  HttpException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { LoginAuthDto } from './dto/login-auth.dto';
// import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { nombre, email, password } = createUserDto;

    if (!email || !password || !nombre) {
      throw new HttpException('Bad Request', 400);
    }

    const plainTextPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }
    try {
      const user = await this.userModel.create({
        nombre,
        email,
        password: plainTextPassword,
      });
      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    // Buscar usuario
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('USER NOT FOUND', 404);
    }

    // Verificar contraseña
    const passwordValid = await bcrypt.compare(password, user.password);
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

  findAll() {
    return this.userModel.find();
  }

  async findOne(term: string) {
    if (!isValidObjectId(term)) {
      throw new BadRequestException(`Invalid user id: ${term}`);
    }

    const user = await this.userModel.findById(term);

    if (!user) {
      throw new NotFoundException(`User with id ${term} not found`);
    }
    return user;
  }

  async update(term: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(term);

    try {
      await user.updateOne(updateUserDto, { new: true });
      return { ...user.toJSON(), ...updateUserDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const user = await this.findOne(id);
    // await user.deleteOne();

    //const deleted = await this.userModel.findByIdAndDelete(id);

    const { deletedCount } = await this.userModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`User with id ${id} not found`);
    }

    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `User exists ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Can't create User - Check server logs`,
    );
  }
}
