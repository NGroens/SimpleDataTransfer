import { Module } from '@nestjs/common';
import { CodeController } from './code/code.controller';
import { CodeService } from './code/code.service';
import { DownloadController } from './download/download.controller';
import { DownloadService } from './download/download.service';


@Module({
    imports: [],
    controllers: [CodeController, DownloadController],
    providers: [CodeService, DownloadService],
})
export class RestModule {}
