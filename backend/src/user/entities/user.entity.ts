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
}

export const UserSchema = SchemaFactory.createForClass(User);