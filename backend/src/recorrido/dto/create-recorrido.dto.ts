import { IsString, IsNumber } from "class-validator";

export class CreateRecorridoDto {

    @IsString()
    nombre: string;

    @IsString()
    autor: string;

    @IsNumber()
    precio: number;

    @IsNumber()
    duracion: number;
}