import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Recorrido extends Document {
  // Usamos el _id de MongoDB como identificador (no externalId)

  @Prop({
    required: true,
    index: true,
  })
  name: string;

  @Prop({
    required: true,
    index: true,
  })
  category: string;

  @Prop({
    required: true,
    index: true,
  })
  difficulty: string;

  @Prop({ required: true })
  rating: number;

  @Prop()
  address?: string;

  @Prop({ type: { lat: Number, lng: Number }, required: true })
  location: { lat: number; lng: number };
}

export const RecorridoSchema = SchemaFactory.createForClass(Recorrido);