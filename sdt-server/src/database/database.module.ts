import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from 'nestjs-config';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: 'mongodb://' + configService.get('database.host') + ': ' + configService.get('database.port')+'/' + configService.get('database.database'),
            }),
            inject: [ConfigService],
        })
    ],
    providers: [],
    exports: [],
})
export class DatabaseModule {
}
