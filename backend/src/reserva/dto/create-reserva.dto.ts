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
<<<<<<< HEAD
=======

class DatosTarjetaDto {
  @IsString()
  tipo: string;

  @IsString()
  categoria: string;

  @IsString()
  ultimosDigitos: string;

  @IsString()
  vencimiento: string;
}
>>>>>>> 451ac5e6658109e4d7979ea01aa213003018e42f

export class CreateReservaDto {
  @IsString()
  nombre: string;

<<<<<<< HEAD
=======
  @IsOptional()
  @IsString()
  apellido?: string;

>>>>>>> 451ac5e6658109e4d7979ea01aa213003018e42f
  @IsEmail()
  email: string;

  @IsString()
  telefono: string;

  @IsDateString()
  fecha: Date;

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

  @IsOptional()
  @IsNumber()
  cantidadPersonas?: number;

  @IsOptional()
  @IsString()
  tourId?: string;

  @IsOptional()
  @IsNumber()
  capacidadUtilizada?: number;

  @IsOptional()
  @IsNumber()
  descuentoAplicado?: number;

  @IsOptional()
  @IsString()
  metodoPago?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DatosTarjetaDto)
  datosTarjeta?: DatosTarjetaDto;

  @IsOptional()
  @IsString()
  emailAgencia?: string | null;

  @IsOptional()
  @IsDateString()
  fechaReserva?: Date;
}
