import { IsString, IsDateString, IsNumber, IsEmail, IsOptional } from "class-validator";

export class CreateReservaDto {

    @IsEmail({}, { message: 'El formato del correo es inválido' })
    @IsOptional()
    email?: string;

    @IsString()
    descripcion: string;

    @IsDateString()
    fechaLlegada: string;

    @IsDateString()
    fechaSalida: string;

    @IsNumber()
    cantidadPersonas: number;

    @IsNumber()
    precio: number;
}