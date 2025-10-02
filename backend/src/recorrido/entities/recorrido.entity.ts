import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Recorrido extends Document {

    @Prop({
        required: true,
        index: true,
    })
    nombre: string;

    @Prop({
        required: true,
        index: true,
    })
    autor: string;

    @Prop({
        required: true,
        index: true,
    })
    precio: number;

    @Prop({
        required: true,
        index: true,
    })
    duracion: number;
}

export const RecorridoSchema = SchemaFactory.createForClass(Recorrido);