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

export class CreateReservaDto {
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

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
