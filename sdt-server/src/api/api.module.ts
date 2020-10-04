import { Global, Module } from '@nestjs/common';
import { RestModule } from './rest/rest.module';
import { WebsocketModule } from './ws/websocket.module';
import { CodeManagerService } from './code-manager.service';

@Global()
@Module({
    imports: [RestModule, WebsocketModule],
    controllers: [],
    providers: [CodeManagerService],
    exports: [CodeManagerService]
})
export class ApiModule {
}
