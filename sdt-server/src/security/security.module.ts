import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from 'nestjs-config';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('security.SECRET'),
                signOptions: { expiresIn: configService.get('security.EXPIRES_IN') },

            }),
            inject: [ConfigService],
        })
    ],
    controllers: [],
    providers: [],
    exports: [JwtModule]
})
export class SecurityModule {
}
