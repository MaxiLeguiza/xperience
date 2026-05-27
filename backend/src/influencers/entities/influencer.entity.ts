import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InfluencerDocument = Influencer & Document;

@Schema({ timestamps: true }) // Agrega automáticamente createdAt y updatedAt
export class Influencer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  handle: string;

  @Prop({ required: true })
  description: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: [], maxlength: 5 })
  mainCategories: string[]; // Máximo 5 categorías principales

  @Prop({ type: Object })
  stats: Record<string, any>;

  @Prop()
  avatar: string;

  @Prop()
  image: string; // Foto de portada

  @Prop({ default: [] })
  followers: string[]; // Array de IDs de usuarios que siguen

  @Prop({ default: [] })
  countries: string[]; // Array de códigos de país visitados

  @Prop({ type: [String], default: [] })
  tours: string[]; // IDs de tours/recorridos asociados
}

export const InfluencerSchema = SchemaFactory.createForClass(Influencer);