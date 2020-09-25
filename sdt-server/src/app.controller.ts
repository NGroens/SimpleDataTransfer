import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from 'nestjs-config';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private readonly config: ConfigService) {
        this.config = config;
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('test')
    getTest(): string {
        return this.config.get('express.port');
    }
}
