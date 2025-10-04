import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Qr extends Document {

    @Prop({ required: true })
  recorridoId: string;

  @Prop({ required: true })  // el PNG en base64 (lo que ya guardás)
  qr: string;

  @Prop({ default: false })
  used: boolean;

  @Prop()
  usedAt?: Date;

  @Prop()
  usedBy?: string; // id del usuario que lo redimió (opcional)
}

export const QrSchema = SchemaFactory.createForClass(Qr);