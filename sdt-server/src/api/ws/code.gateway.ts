import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, } from '@nestjs/websockets';
import { Server } from 'ws';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class CodeGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('code/generate')
    handleGeneration(client: Socket, data: string): WsResponse<any> {
        this.server.emit('events', { name: 'Nest' });
        return { event: 'changeMe', data: data };
    }

    @SubscribeMessage('code/login')
    handleLogin(client: Socket, data: string): WsResponse<any> {
        return { event: 'changeMe', data: data };
    }

    @SubscribeMessage('code/check')
    handleCheck(client: Socket, data: string): WsResponse<any>{

        return {event: 'changeME', data: data}
    }
}
