import { Global, Module } from '@nestjs/common';
import { CodeGateway } from './code.gateway';
import { WebsocketService } from './websocket.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [CodeGateway, WebsocketService],
    exports: [WebsocketService]
})
export class WebsocketModule {
}
