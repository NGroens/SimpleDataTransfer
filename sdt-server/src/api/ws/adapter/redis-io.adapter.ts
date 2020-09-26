import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import { ConfigService } from 'nestjs-config';

export class RedisIoAdapter extends IoAdapter {
    constructor(private readonly config: ConfigService) {
        super();
        this.config = config;
    }

    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        const redisAdapter = redisIoAdapter({ host: 'localhost', port: 6379 });
        server.adapter(redisAdapter);
        return server;
    }
}
