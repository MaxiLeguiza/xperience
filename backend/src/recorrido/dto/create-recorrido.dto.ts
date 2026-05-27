import { IsString, IsNumber, IsOptional, ValidateNested, IsArray, IsBoolean, ValidateIf } from "class-validator";
import { Type } from "class-transformer";

class LocationDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

class WaypointDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

class InfluencerDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  social?: string;
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

  // 🔥 NUEVOS CAMPOS
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @IsOptional()
  @IsNumber()
  distanceKm?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WaypointDto)
  waypoints?: WaypointDto[];

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  isPackage?: boolean;

  @IsOptional()
  @IsString()
  influencerId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => InfluencerDto)
  influencer?: InfluencerDto;

  @IsOptional()
  @IsBoolean()
  allowMultiRoute?: boolean;
}