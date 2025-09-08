import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Reserva extends Document {

    @Prop({
        required: true,
        index: true, 
    })
    descripcion: string;

    @Prop({ 
        required: true,
        index: true, 
    })
    fechaLlegada: Date;

    @Prop({ 
        required: true,
        index: true 
    })
    fechaSalida: Date;

    @Prop({ 
        required: true,
        index: true 
    })
    cantidadPersonas: number;

    @Prop({ 
        required: true,
        index: true 
    })
    precio: number;
}

export const ReservaSchema = SchemaFactory.createForClass(Reserva);
