import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
      // ConfigModule puede ser global si querés
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ['server/.env', '.env'],
      }),
  
      // Conectamos el esquema Auth a Mongo
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  
      // JWT
      JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (cfg: ConfigService) => ({
          global: true,
          secret: cfg.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
        }),
      }),
    ],
})
export class UserModule {}
