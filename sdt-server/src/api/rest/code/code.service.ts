import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WebsocketService } from '../../ws/websocket.service';
import { CodeManagerService } from '../../code-manager.service';
import { SendTextDto } from '../../../utils/code/sendText.dto';
import { BackendType } from '../../../utils/code/sendFile.dto';
import { InjectS3, S3 } from 'nestjs-s3';
import { S3BucketService } from '../../../storage/s3-bucket.service';
import { ConfigService } from 'nestjs-config';

@Injectable()
export class CodeService implements OnModuleInit {
    constructor(
        private websocketService: WebsocketService,
        private codeManagerService: CodeManagerService,
        private configService: ConfigService,
        @InjectS3() private readonly s3: S3,
        private s3BucketService: S3BucketService
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
        switch (backendType.toUpperCase()) {

            case BackendType.S3.toUpperCase(): {

                files.forEach((file) => {
                    //TODO generate random name and insert file to database
                    this.uploadS3(file.buffer, this.configService.get('storagebackend.S3_DEFAULT_BUCKET'),code+'/'+file.originalname)
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
        //TODO do upload shit like upload to s3 and send websocket message
        return 'upload successful!';
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
