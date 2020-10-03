import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as module from 'module';

/**
 Json-Object
 {
 "uuid":"UUID",
 "code": "1234567890"
 "data": [
       {
        "type":"file"
        "
       }
    ]
 }
 **/
//TODO add createdAt field
@Schema()
export class Code extends Document {
    @Prop({
        required: 'Code isn\'t provided.',
        index: {
            unique: true
        }
    })
    code: string;

    @Prop(raw(
        {
            fileID: { type: String, unique: true },
            storageType: { type: String, enum: ['s3', 'local'] },
            domain: { type: String },
            fileUrl: { type: String },
            date: { type: String }
        }
    ))
    files: Record<string, any>[];
    @Prop(raw(
        {
            textID: { type: String, unique: true },
            text: { type: String },
            date: { type: String }
        }
    ))
    texts: Record<string, any>[];

}

export const CodeSchema = SchemaFactory.createForClass(Code);
