import { Module } from '@nestjs/common';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';


@Module({
    imports: [],
    controllers: [CodeController],
    providers: [CodeService],
})
export class CodeModule {}
