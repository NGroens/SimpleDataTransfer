import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeService {
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

    sendText(code: any, body: any) {
        return body;
    }
}
