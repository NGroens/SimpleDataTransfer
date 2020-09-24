import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CodeService } from './code.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('/api')
export class CodeController {
    constructor(private readonly codeService: CodeService) {
    }

    @Get()
    getHello(): string {
        return this.codeService.getHello();
    }

    @Post('/code/:code/files')
    @UseInterceptors(FilesInterceptor('files'))
    sendFiles(@Param('code') code, @UploadedFiles() files): string {
        return this.codeService.sendFiles(code, files);
    }

    @Post('/code/:code/text')
    sendText(@Param('code') code, @Body() body): string {
        console.log(body)
        return this.codeService.sendText(code, body);
    }
}
