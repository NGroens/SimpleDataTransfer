import { Injectable } from '@nestjs/common';
import { Code } from '../schemas/code.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebsocketService } from './ws/websocket.service';


@Injectable()
export class CodeManagerService {
    constructor(
        @InjectModel(Code.name) private codeModel: Model<Code>,
        private websocketService: WebsocketService
    ) {
    }

    async findByCode(code): Promise<Code> {
        return await this.codeModel.findOne({ code: code }).exec();
    }

    async userIsOnlineByCode(code): Promise<boolean> {
        const requestedCode = await this.findByCode(code);
        if (!requestedCode) {
            return Promise.resolve(false);
        }

        return new Promise(resolve => {
            this.websocketService.getSocketServer().of('/').adapter.clients(['code/' + code], (err, clients) => {
                console.log(clients.length);
                if (clients.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    async addTextToCode(code, sendTextDto): Promise<boolean> {
        const requtestedCode = await this.findByCode(code);
        if (!requtestedCode) {
            return Promise.resolve(false);
        }
        console.log(requtestedCode.texts);
        if (requtestedCode.texts.length <= 0) {
            requtestedCode.texts = [];
        }
        console.log(requtestedCode.texts.length);
        requtestedCode.texts.push({
            title: sendTextDto.title,
            text: sendTextDto.text,
            date: Math.floor(Date.now() / 1000)
        });

        return new Promise(resolve => {
            requtestedCode.save().then(() => {
                resolve(true);
            }).catch((error) => {
                resolve(false);
            });
        });
    }

    async addFileToCode(code, storageType, domain, fileUrl, originalName): Promise<boolean> {
        const requtestedCode = await this.findByCode(code);
        if (!requtestedCode) {
            return Promise.resolve(false);
        }
        if (requtestedCode.files.length <= 0) {
            requtestedCode.files = [];
        }
        requtestedCode.files.push({
            storageType: storageType.toUpperCase(),
            domain: domain,
            fileUrl: fileUrl,
            originalName: originalName,
            date: Math.floor(Date.now() / 1000)
        });


        return new Promise(resolve => {
            requtestedCode.save().then(() => {
                console.log('trest');
                resolve(true);
            }).catch((error) => {
                console.log(error);
                resolve(false);
            });
        });
    }

    async addFilesToCode(code, files): Promise<boolean> {
        const requtestedCode = await this.findByCode(code);
        if (!requtestedCode) {
            return Promise.resolve(false);
        }
        if (requtestedCode.files.length <= 0) {
            requtestedCode.files = [];
        }
        files.forEach((file) => {
            requtestedCode.files.push(file);
        });


        return new Promise(resolve => {
            requtestedCode.save().then((updatedCode) => {
                console.log(updatedCode);
                resolve(true);
            }).catch((error) => {
                console.log(error);
                resolve(false);
            });
        });
    }

    async updateFileArray(code, fileArray) {
        const requtestedCode = await this.findByCode(code);
        if (!requtestedCode) {
            return Promise.resolve(false);
        }
        if (requtestedCode.files.length <= 0) {
            requtestedCode.files = [];
        }

        requtestedCode.files = fileArray;


        return new Promise(resolve => {
            requtestedCode.save().then((updatedCode) => {
                resolve(true);
            }).catch((error) => {
                resolve(false);
            });
        });
    }

    async getFileDocumentByID(fileID) {
        const code = await this.codeModel.findOne({ 'files._id': { $gte: fileID } }).exec();

        return new Promise(resolve => {
            code.files.forEach((file) => {
                if (file._id == fileID) {
                    resolve({ code: code.code, fileDocument: file });
                }
            });
        });


    }

    async getCodeDocumentByFIleID(fileID) {

        return await this.codeModel.findOne({ 'files._id': { $gte: fileID } }).exec();

    }
}
