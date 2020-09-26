import {Prop, raw, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
export class Code extends Document {
    @Prop({
        required: "UUID isn't provided.",
        index: {
            unique: true
        }
    })
    uuid: string;
    @Prop({
        required: "Code isn't provided.",
        index: {
            unique: true
        }
    })
    code: string; 
}

export const CodeSchema = SchemaFactory.createForClass(Code);
