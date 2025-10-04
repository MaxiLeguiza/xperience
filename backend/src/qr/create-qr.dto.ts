import { IsString, IsDateString, IsNumber } from "class-validator";

export class CreateQrDto {

    @IsString()
    recorridoId: string;
}