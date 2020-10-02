import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';
import { SchemaModule } from './schemas/schema.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        SchemaModule,
        DatabaseModule,
        ApiModule,
        ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
