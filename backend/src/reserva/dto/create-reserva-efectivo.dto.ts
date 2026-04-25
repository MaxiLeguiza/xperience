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
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  nombre: string;

  @IsString()
  precio: string;

  @IsOptional()
  @IsNumber()
  capacidad?: number;

  @IsOptional()
  @IsString()
  image?: string;
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

export class CreateReservaEfectivoDto {
  @IsString()
  nombre: string;

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

  @IsString()
  paymentMethod: string;

  // Campos adicionales para Efectivo
  @IsNumber()
  cantidadPersonas: number;

  @IsOptional()
  @IsString()
  tourId?: string;

  @IsNumber()
  capacidadUtilizada: number;

  @IsNumber()
  descuentoAplicado: number;

  @IsString()
  metodoPago: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DatosTarjetaDto)
  datosTarjeta?: DatosTarjetaDto;

  @IsOptional()
  @IsString()
  emailAgencia?: string;

  @IsDateString()
  fechaReserva: Date;

  @IsOptional()
  @IsString()
  apellido?: string;
}
