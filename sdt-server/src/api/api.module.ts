import { Module } from '@nestjs/common';
import { RestModule } from './rest/rest.module';
import { WebsocketModule } from './ws/websocket.module';


@Module({
    imports: [RestModule, WebsocketModule],
    controllers: [],
    providers: [],
})
export class ApiModule {}
