<<<<<<< HEAD
import { IsString, IsDateString, IsNumber, IsEmail, IsOptional } from "class-validator";
=======
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class ReservaItemDto {
  @IsString()
  id: string;

  @IsString()
  nombre: string;

  @IsString()
  precio: string;

  @IsOptional()
  @IsNumber()
  capacidad?: number;
}
>>>>>>> 1950221a7841ef5d04293f7dc154c36ac7851838

export class CreateReservaDto {
  @IsString()
  nombre: string;

<<<<<<< HEAD
    @IsEmail({}, { message: 'El formato del correo es inválido' })
    @IsOptional()
    email?: string;

    @IsString()
    descripcion: string;

    @IsDateString()
    fechaLlegada: string;

    @IsDateString()
    fechaSalida: string;
=======
  @IsEmail()
  email: string;

  @IsString()
  telefono: string;

  @IsDateString()
  fecha: Date;
>>>>>>> 1950221a7841ef5d04293f7dc154c36ac7851838

  @IsOptional()
  @IsString()
  notas?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReservaItemDto)
  items: ReservaItemDto[];

  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
