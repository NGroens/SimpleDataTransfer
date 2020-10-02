import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Code, CodeSchema } from './code.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Code.name, schema: CodeSchema }
    ])],
    controllers: [],
    providers: [],
})
export class SchemaModule {
}
