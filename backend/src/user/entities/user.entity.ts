import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
  @Prop({ 
    required: true,
    index: true, 
  })
  nombre: string;

  @Prop({ 
    required: true,
    index: true,
    unique: true 
  })
  email: string;

  @Prop({ 
    required: true,
    index: true 
  })
  password: string;

  // 🔥 NUEVO: Guardamos el rol. Si no se envía en el registro, asume 'user'
  @Prop({
    default: 'user'
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);