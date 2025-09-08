import { IsString, IsDateString, IsNumber } from "class-validator";

export class CreateReservaDto {

    @IsString()
    descripcion: string;

    @IsDateString()
    fechaLlegada: Date;

    @IsDateString()
    fechaSalida: Date;

    @IsNumber()
    cantidadPersonas: number;

    @IsNumber()
    precio: number;
}