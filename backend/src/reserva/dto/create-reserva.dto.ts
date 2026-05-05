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

export class CreateReservaDto {
  @IsString()
  nombre: string;

  @IsOptional()

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
