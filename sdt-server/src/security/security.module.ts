import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from 'nestjs-config';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('SECURITY.SECRET'),
                signOptions: { expiresIn: configService.get('SECURITY.EXPIRES_IN') },

            }),
            inject: [ConfigService],
        })
    ],
    controllers: [],
    providers: [],
})
export class SecurityModule {
}
