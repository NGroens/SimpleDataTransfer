import { Injectable } from '@nestjs/common';
import { Server } from 'ws';


@Injectable()
export class WebsocketService {

    private socket: Server = null;

    getSocketServer(): Server {
        return this.socket;
    }
    setSocketServer(socket: Server){
        this.socket = socket;
    }
}
