import { Module } from '@nestjs/common';
import { CodeController } from './code/code.controller';
import { CodeService } from './code/code.service';


@Module({
    imports: [],
    controllers: [CodeController],
    providers: [CodeService],
})
export class RestModule {}
