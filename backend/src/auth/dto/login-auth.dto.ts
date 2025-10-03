import { RegisterAuthDto } from './register-auth.dto';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginAuthDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    accessKey: string;
}