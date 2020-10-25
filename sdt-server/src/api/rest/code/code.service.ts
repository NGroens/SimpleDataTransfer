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
                    const fileName = this.utilsService.makeid(64) + '.' + this.utilsService.getFileExtension(file.originalname);
                    newFiles.push({
                        storageType: 'S3',
                        domain: this.configService.get('storagebackend.S3_END_POINT'),
                        fileUrl: this.configService.get('storagebackend.S3_DEFAULT_BUCKET') + '/' + code + '/' + fileName,
                        originalName: file.originalname,
                        fileName: fileName,
                        date: Date.now()
                    });

                    const upload = await this.uploadS3(file.buffer, this.configService.get('storagebackend.S3_DEFAULT_BUCKET'), code + '/' + fileName);
                    const setPermissions = await this.addBucketPermissions(
                        code + '/' + fileName,
                        this.configService.get('storagebackend.S3_DEFAULT_BUCKET')
                    );
                    if (!upload || !setPermissions) {
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
                let newFiles = [];

                for (const file of files) {

                    const fs = require('fs');
                    const fileName = this.utilsService.makeid(64) + '.' + this.utilsService.getFileExtension(file.originalname);
                    const filePath = this.configService.get('storagebackend.LOCAL_DIR') + '/' + code;
                    console.log(fs.existsSync(filePath));
                    if (!await fs.existsSync(filePath)) {
                        await fs.mkdirSync(filePath, { recursive: true });
                    }
                    const saveSuccess = await new Promise((resolve, reject) => {
                        fs.writeFile(filePath + '/' + fileName, file.buffer, (err) => {
                            // throws an error, you could also catch it here
                            if (err) {
                                console.log(err);
                                Logger.error(err);
                                resolve(false);
                            }

                            resolve(true);
                        });
                    });
                    if (!saveSuccess) {
                        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);

                    }
                    newFiles.push({
                        storageType: 'LOCAL',
                        domain: this.configService.get('storagebackend.LOCAL_DOMAIN'),
                        fileUrl: this.configService.get('storagebackend.LOCAL_END_POINT_URL') + '/' + code + '/' + fileName,
                        originalName: file.originalname,
                        fileName: fileName,
                        date: Date.now()
                    });
                }

                const added = await this.codeManagerService.addFilesToCode(code, newFiles);

                if (!added) {
                    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
                }
                let updateFiles = [];
                let allNewFiles = [];
                const updatedCode = await this.codeManagerService.findByCode(code);
                for (const file of updatedCode.files) {
                    const updated = await this.updateFileArray(file, newFiles)
                    if (updated['updated']) {
                        allNewFiles.push(updated['file']);
                        updateFiles.push(updated['file']);
                    } else {
                        allNewFiles.push(file);
                    }
                }
                const codeUpdated = this.codeManagerService.updateFileArray(code, allNewFiles);
                if (!codeUpdated) {
                    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
                }
                this.websocketService.getSocketServer().to('code/' + code).emit('code/files', {
                    files: updateFiles
                });

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

    async addBucketPermissions(principal, bucketName) {
        var readOnlyAnonUserPolicy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Sid: 'AddPerm',
                    Effect: 'Allow',
                    Principal: '*',
                    Action: [
                        's3:GetObject'
                    ],
                    Resource: [
                        ''
                    ]
                }
            ]
        };

// create selected bucket resource string for bucket policy
        var bucketResource = 'arn:aws:s3:::' + bucketName + '/*';
        readOnlyAnonUserPolicy.Statement[0].Resource[0] = bucketResource;

// convert policy JSON into string and assign into params
        var bucketPolicyParams = { Bucket: bucketName, Policy: JSON.stringify(readOnlyAnonUserPolicy) };
        return new Promise((resolve, reject) => {
            // set the new policy on the selected bucket
            this.s3.putBucketPolicy(bucketPolicyParams, function(err, data) {
                if (err) {
                    resolve(false);
                    // display error message
                    console.log('Error', err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    async updateFileArray(file, newFiles){
        return new Promise((resolve => {
            newFiles.forEach((newFile) => {
                if (file.fileName === newFile.fileName) {
                    file.fileUrl = 'download/' + file.id;
                    resolve({updated: true, file: file});
                    return;
                }
                resolve({ updated: false });
            });
        }));
    }

}
