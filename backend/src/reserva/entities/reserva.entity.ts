import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Reserva extends Document {
  @Prop({
    required: true,
    index: true,
  })
  nombre: string;

  @Prop({
    required: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
    index: true,
  })
  telefono: string;

  @Prop({
    required: true,
    index: true,
  })
  fecha: Date;

  @Prop({
    default: "",
  })
  notas?: string;

  @Prop({
    type: [Object],
    default: [],
  })
  items: Array<{
    id: string;
    nombre: string;
    precio: string;
    capacidad?: number;
  }>;

  @Prop({
    required: true,
    index: true,
  })
  total: number;

  @Prop({
    default: "credito",
  })
  paymentMethod?: string;
}

export const ReservaSchema = SchemaFactory.createForClass(Reserva);
