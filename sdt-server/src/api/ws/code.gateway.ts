import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, } from '@nestjs/websockets';
import { Server } from 'ws';
import { Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Code } from '../../schemas/code.schema';
import { Model } from 'mongoose';

@WebSocketGateway()
export class CodeGateway {

    constructor(
        @InjectModel(Code.name) private userModel: Model<Code>,
        // private jwtService: JwtService
    ) {
    }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('code/generate')
    handleGeneration(client: Socket, data: string): WsResponse<any> {
        console.log(data);

        this.server.emit('events', { name: 'Nest' });
        return { event: 'changeMe', data: data };
    }

    @SubscribeMessage('code/login')
    handleLogin(client: Socket, data: string): WsResponse<any> {
        return { event: 'changeMe', data: data };
    }

    @SubscribeMessage('code/check')
    handleCheck(client: Socket, data: string): WsResponse<any> {

        return { event: 'changeME', data: data };
    }
}
