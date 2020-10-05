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
            console.log('moin moi');
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
}
