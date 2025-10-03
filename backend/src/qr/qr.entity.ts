import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Qr extends Document {

    @Prop({
        required: true,
        index: true,
    })
    qr: string;
}

export const QrSchema = SchemaFactory.createForClass(Qr);