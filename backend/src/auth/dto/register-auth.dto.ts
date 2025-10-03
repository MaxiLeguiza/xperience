import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDtoAuthDto {}

export class RegisterAuthDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  accessKey: string;
}
