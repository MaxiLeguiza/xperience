import { IsEmail, IsString, MinLength, IsOptional, IsIn } from "class-validator";

export class CreateUserDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  // 🔥 NUEVO: Campo de rol opcional validado
  @IsOptional()
  @IsString()
  @IsIn(['user', 'agencia', 'influencer'])
  role?: string;
}