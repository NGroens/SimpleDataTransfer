import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import { ConfigService } from 'nestjs-config';

export class RedisIoAdapter extends IoAdapter {


    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        const redisAdapter = redisIoAdapter({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            //username: process.env.REDIS_USERNAME || null,
          //  password: process.env.REDIS_PASSWORD || null
        });
        server.adapter(redisAdapter);
        return server;
    }
}
