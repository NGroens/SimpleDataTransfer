import { Controller, Get, HttpException, HttpStatus, Param, Res } from '@nestjs/common';
import { DownloadService } from './download.service';
import { ConfigService } from 'nestjs-config';

@Controller()
export class DownloadController {
    constructor(
        private readonly downloadService: DownloadService,
        private configService: ConfigService
    ) {
    }

    @Get('/download/:code/:filename')
    downloadFile(@Res() res, @Param('code') code, @Param('filename') filename,): string {
        // TODO download file from file object id and not code and filename
        const fs = require('fs');
        const filePath = this.configService.get('storagebackend.LOCAL_DIR') + '/' + code + '/' + filename;
        if(!fs.existsSync(filePath)){
            throw  new  HttpException('File not found', HttpStatus.NOT_FOUND);
        }
        return res.download(filePath);
    }
}
