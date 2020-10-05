import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CodeService } from './code.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SendTextDto } from '../../../utils/code/sendText.dto';
import { WebsocketService } from '../../ws/websocket.service';

@Controller('/api')
export class CodeController {
    constructor(
        private readonly codeService: CodeService,
        private websocketService: WebsocketService
    ) {
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
    async sendText(@Param('code') code, @Body() sendTextDto: SendTextDto): Promise<string> {

        if (!await this.codeService.sendText(code, sendTextDto)) {
            throw new HttpException('Internal server error. Please try again!', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        this.websocketService.getSocketServer().to('code/'+code).emit('code/text', {text: sendTextDto.text, title: sendTextDto.title, date: Date.now})
        return JSON.stringify({statusCode: 200});
    }
}
