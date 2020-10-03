import { Module } from '@nestjs/common';
import { CodeGateway } from './code.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Code, CodeSchema } from '../../schemas/code.schema';


@Module({
    imports: [],
    controllers: [],
    providers: [CodeGateway],
})
export class WebsocketModule {}
