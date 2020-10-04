import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WebsocketService } from '../../ws/websocket.service';
import { CodeManagerService } from '../../code-manager.service';
import { SendTextDto } from '../../../utils/code/sendText.dto';

@Injectable()
export class CodeService {
    constructor(
        private websocketService: WebsocketService,
        private codeManagerService: CodeManagerService
    ) {
    }

    getHello(): string {
        return 'Hello World!';
    }

    /**
     * Handle file upload
     * @description Upload files to s3 storage and send websocket message to file requester if upload was successful
     * @param code
     * @param files
     */
    sendFiles(code: any, files: any) {

        //TODO do upload shit like upload to s3 and send websocket message
        return 'upload successful!';
    }

    async sendText(code: any, sendTextDto: SendTextDto) {
        const isOnline = await this.codeManagerService.userIsOnlineByCode(code);
        console.log(sendTextDto);
        if(!sendTextDto['text']){
            throw new HttpException('Empty body', HttpStatus.BAD_REQUEST)
        }

        if (!isOnline) {
            throw new HttpException('Code not found', HttpStatus.NOT_FOUND);
        }


        return await this.codeManagerService.addTextToCode(code, sendTextDto['text']);

    }
}
