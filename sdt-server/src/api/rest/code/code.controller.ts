import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CodeService } from './code.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SendTextDto } from '../../../utils/code/sendText.dto';

@Controller('/api')
export class CodeController {
    constructor(private readonly codeService: CodeService) {
    }

    @Get()
    getHello(): string {
        return this.codeService.getHello();
    }


    /**
     * Handle file upload
     * @description Send files to CodeService function
     * @param code
     * @param files
     */
    @Post('/code/:code/files')
    @UseInterceptors(FilesInterceptor('files'))
    sendFiles(@Param('code') code, @UploadedFiles() files): string {
        return this.codeService.sendFiles(code, files);
    }

    /**
     * Handle text send
     * @description Send text to CodeService function
     * @param code
     * @param sendTextDto
     */
    @Post('/code/:code/text')
    async sendText( @Param('code') code, @Body() sendTextDto: SendTextDto): Promise<string> {
        console.log(code);
        return JSON.stringify({ success: await this.codeService.sendText(code, sendTextDto) });
    }
}
