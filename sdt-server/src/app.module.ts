import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';
import { SchemaModule } from './schemas/schema.module';
import { DatabaseModule } from './database/database.module';
import { SecurityModule } from './security/security.module';
import { UtilsService } from './utils/utils.service';
import { ValidatorService } from './utils/validator.service';
import { StorageModule } from './storage/storage.module';

@Global()
@Module({
    imports: [
        DatabaseModule,
        SchemaModule,
        SecurityModule,
        ApiModule,
        ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
        StorageModule
    ],
    controllers: [AppController],
    providers: [AppService, UtilsService, ValidatorService],
    exports: [UtilsService, ValidatorService]
})
export class AppModule {
}
