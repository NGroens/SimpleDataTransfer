import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WebsocketService } from '../../ws/websocket.service';
import { CodeManagerService } from '../../code-manager.service';
import { SendTextDto } from '../../../utils/code/sendText.dto';
import { BackendType } from '../../../utils/code/sendFile.dto';
import { InjectS3, S3 } from 'nestjs-s3';
import { S3BucketService } from '../../../storage/s3-bucket.service';
import { ConfigService } from 'nestjs-config';
import { UtilsService } from '../../../utils/utils.service';

@Injectable()
export class CodeService implements OnModuleInit {
    constructor(
        private websocketService: WebsocketService,
        private codeManagerService: CodeManagerService,
        private configService: ConfigService,
        @InjectS3() private readonly s3: S3,
        private s3BucketService: S3BucketService,
        private utilsService: UtilsService
    ) {
    }


    async onModuleInit() {
        if (!await this.s3BucketService.bucketExists(this.configService.get('storagebackend.S3_DEFAULT_BUCKET'))) {
            try {
                await this.s3.createBucket({ Bucket: this.configService.get('storagebackend.S3_DEFAULT_BUCKET') }).promise();
            } catch (e) {
                console.log(e);
            }
        }
    }

    getHello(): string {
        return 'Hello World!';
    }

    /**
     * Handle file upload
     * @description Upload files to s3 storage and send websocket message to file requester if upload was successful
     * @param code
     * @param files
     * @param backendType
     */
    async sendFiles(code: any, files: any, backendType) {
        const isOnline = await this.codeManagerService.userIsOnlineByCode(code);
        if (!isOnline) {
            throw new HttpException('Code not found', HttpStatus.NOT_FOUND);
        }
        switch (backendType.toUpperCase()) {

            case BackendType.S3.toUpperCase(): {
                let newFiles = [];
                for (const file of files) {
                    //TODO generate random name and insert file to database
                    const fileName = this.utilsService.makeid(64) + '.' + this.utilsService.getFileExtension(file.originalname);
                    newFiles.push({
                        storageType: 'S3',
                        domain: this.configService.get('storagebackend.S3_END_POINT'),
                        fileUrl: this.configService.get('storagebackend.S3_DEFAULT_BUCKET') + '/' + code + '/' + fileName,
                        originalName: file.originalname,
                        date: Math.floor(Date.now() / 1000)
                    });
                    const upload = await this.uploadS3(file.buffer, this.configService.get('storagebackend.S3_DEFAULT_BUCKET'), code + '/' + fileName);
                    if (!upload) {
                        throw new HttpException('Error', HttpStatus.SERVICE_UNAVAILABLE);
                    }
                }

                const added = await this.codeManagerService.addFilesToCode(code, newFiles);

                if (!added) {
                    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
                }

                this.websocketService.getSocketServer().to('code/' + code).emit('code/files', {
                    files: newFiles
                });
                break;
            }

            case BackendType.LOCAL.toUpperCase(): {

                break;
            }

            default: {
                throw new HttpException('Not a valid backend-type', HttpStatus.BAD_REQUEST);
            }
        }
        return JSON.stringify({
            statusCode: 200,
            message: 'Upload successful'
        });
    }

    async sendText(code: any, sendTextDto: SendTextDto) {
        const isOnline = await this.codeManagerService.userIsOnlineByCode(code);
        if (!sendTextDto['text'] || !sendTextDto['title']) {
            throw new HttpException('Empty body', HttpStatus.BAD_REQUEST);
        }
        if (!isOnline) {
            throw new HttpException('Code not found', HttpStatus.NOT_FOUND);
        }
        return await this.codeManagerService.addTextToCode(code, sendTextDto);
    }

    async uploadS3(file, bucket, name) {

        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
        };
        return new Promise((resolve, reject) => {
            this.s3.upload(params, (err, data) => {
                if (err) {
                    Logger.error(err);
                    reject(err.message);
                }
                resolve(data);
            });
        });
    }

}
