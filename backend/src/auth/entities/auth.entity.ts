import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Auth extends Document {

    @Prop({
        required: true,
        index: true,
    })
    email: string;

    @Prop({
        required: true,
        index: true,
    })
    accessKey: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);