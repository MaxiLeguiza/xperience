import {
  HttpException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  OnModuleInit, // 🔥 NUEVO: Importamos el ciclo de vida de inicialización
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService implements OnModuleInit { // 🔥 NUEVO: Implementamos OnModuleInit
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  // =========================================================
  // 🔥 NUEVO: Carga inicial automática (Seed)
  // Se ejecuta automáticamente al arrancar el servidor backend
  // =========================================================
  async onModuleInit() {
    const agenciaEmail = 'agencia@gmail.com';
    const existingAgencia = await this.userModel.findOne({ email: agenciaEmail });

    if (!existingAgencia) {
      console.log('⏳ Creando usuario Agencia de prueba...');
      const hashedPassword = await bcrypt.hash('123456789', 10);
      
      await this.userModel.create({
        nombre: 'Agencia Oficial Xperience',
        email: agenciaEmail,
        password: hashedPassword,
        role: 'agencia', // Le forzamos el rol para que tenga los permisos
      });
      
      console.log('✅ Usuario Agencia creado con éxito: agencia@gmail.com | Pass: 123456789');
    } else {
      console.log('✅ Usuario Agencia de prueba ya se encuentra en la base de datos.');
    }
  }

  // =========================================================
  // Métodos estándar CRUD
  // =========================================================
  async create(createUserDto: CreateUserDto) {
    const { nombre, email, password, role } = createUserDto;

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
        role: role || 'user', 
      });
      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.userModel.findOne({ email: normalizedEmail });
    if (!user) {
      throw new UnauthorizedException('Usuario no registrado');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    
    if (!passwordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { 
      email: user.email, 
      sub: user._id,
      role: user.role,
      nombre: user.nombre
    };
    
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        role: user.role, 
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