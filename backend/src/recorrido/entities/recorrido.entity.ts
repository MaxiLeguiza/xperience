import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document, Types } from "mongoose";

class Waypoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

class Comment {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  timestamp: number;
}

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

  // 🔥 NUEVOS CAMPOS PARA AGENCIA
  @Prop()
  title?: string;

  @Prop()
  description?: string;

  @Prop()
  price?: number;

  @Prop()
  capacity?: number;

  @Prop()
  durationMinutes?: number;

  @Prop()
  distanceKm?: number;

  @Prop([String])
  images?: string[]; // URLs de Cloudinary

  @Prop({ type: [Object], default: [] })
  waypoints?: Waypoint[]; // Paradas del recorrido

  @Prop()
  author?: string;

  @Prop()
  authorId?: string;

  @Prop({ default: 'user' })
  role?: string; // user, agencia, influencer

  @Prop({ default: false })
  isPackage?: boolean;

  @Prop()
  influencerId?: string; // ID del influencer que creó/recomendó el tour

  @Prop({ type: Object })
  influencer?: {
    _id?: string;
    name?: string;
    avatar?: string;
    social?: string;
  };

  @Prop({ default: true })
  allowMultiRoute?: boolean;

  @Prop({ type: [Object], default: [] })
  comments?: Comment[];
}

export const RecorridoSchema = SchemaFactory.createForClass(Recorrido);
