import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Code, CodeSchema } from './code.schema';
@Global()
@Module({
    imports: [MongooseModule.forFeature([
        { name: Code.name, schema: CodeSchema }
    ])],
    controllers: [],
    providers: [],
    exports: [MongooseModule]
})
export class SchemaModule {
}
