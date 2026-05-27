// create-influencer.dto.ts
import { IsString, IsArray, IsObject, IsOptional } from 'class-validator';

export class CreateInfluencerDto {
  @IsString()
  name: string;

  @IsString()
  handle: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mainCategories: string[]; // Máximo 5 categorías principales

  @IsObject()
  @IsOptional()
  stats: Record<string, any>;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  image: string; // Foto de portada

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  followers: string[]; // Array de IDs de usuarios

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  countries: string[]; // Array de códigos de país

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tours: string[]; // IDs de tours asociados
}