import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { S3Module } from 'nestjs-s3';
import { S3BucketService } from './s3-bucket.service';
import { MulterModule } from '@nestjs/platform-express';

@Global()
@Module({
    imports: [
        S3Module.forRootAsync({
            imports: [ConfigModule],
            useFactory:  async (configService: ConfigService) => ({
                config: {
                    accessKeyId: configService.get('storagebackend.S3_ACCESS_KEY'),
                    secretAccessKey: configService.get('storagebackend.S3_SECRET_KEY'),
                    endpoint: configService.get('storagebackend.S3_END_POINT'),
                    s3ForcePathStyle: configService.get('storagebackend.S3_FORCE_PATH_STYLE'),
                    signatureVersion:  configService.get('storagebackend.S3_SIGNATURE_VERSION'),
                },
            }),
            inject: [ConfigService],
        }),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                dest: configService.get('storagebackend.LOCAL_DIR'),
            }),
            inject: [ConfigService],
        })
    ],
    controllers: [],
    providers: [S3BucketService],
    exports: [S3BucketService]
})
export class StorageModule {
}
