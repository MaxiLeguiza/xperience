import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Reserva extends Document {
  @Prop({
    required: true,
    index: true,
  })
  nombre: string;

  @Prop()
  apellido?: string;

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

  // Campos adicionales para reportes y análisis (especialmente para Efectivo)
  @Prop({
    default: 1,
  })
  cantidadPersonas?: number;

  @Prop({
    index: true,
  })
  tourId?: string;

  @Prop({
    default: 0,
  })
  capacidadUtilizada?: number;

  @Prop({
    default: 0,
  })
  descuentoAplicado?: number;

  @Prop({
    type: Object,
  })
  datosTarjeta?: {
    tipo: string;
    categoria: string;
    ultimosDigitos: string;
    vencimiento: string;
  };

  @Prop()
  emailAgencia?: string;

  @Prop({
    default: () => new Date(),
  })
  fechaReserva?: Date;
}

export const ReservaSchema = SchemaFactory.createForClass(Reserva);
