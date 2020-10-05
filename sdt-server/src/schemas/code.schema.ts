import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

    @Prop(raw([
            {
                fileID: { type: String, unique: true },
                storageType: { type: String, enum: ['s3', 'local'] },
                domain: { type: String },
                fileUrl: { type: String },
                date: { type: String, default: Date.now }
            }
        ])
    )
    files: Record<string, any>[];
    @Prop(raw([
        {
            title: { type: String},
            text: { type: String },
            date: { type: String, default: Date.now }
        }
    ]))
    texts: Record<string, any>[];
    @Prop({
        default: Date.now
    })
    createdAt: string;

}

export const CodeSchema = SchemaFactory.createForClass(Code);
