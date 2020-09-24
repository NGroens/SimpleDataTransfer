import { Module } from '@nestjs/common';
import { CodeGateway } from './code.gateway';


@Module({
    imports: [],
    controllers: [],
    providers: [CodeGateway],
})
export class WebsocketModule {}
