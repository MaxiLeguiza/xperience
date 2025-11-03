import { IsString, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class LocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateRecorridoDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  difficulty: string;

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  address?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}