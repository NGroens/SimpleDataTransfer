import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, } from '@nestjs/websockets';
import { Server } from 'ws';
import { Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Code } from '../../schemas/code.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UtilsService } from '../../utils/utils.service';

@WebSocketGateway()
export class CodeGateway {

    constructor(
        @InjectModel(Code.name) private codeModel: Model<Code>,
        private jwtService: JwtService,
        private utilsService: UtilsService
    ) {
    }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('code/generate')
    async handleGeneration(client: Socket, data: string): Promise<WsResponse<any>> {

        const code = this.utilsService.generateCode(10);
        console.log(code);
        const newCode = new this.codeModel({
            code: code
        });
        let returnValue = { event: 'code/generate', data: { success: false } };
        await newCode.save()
            .then((code: Code) => {
                const payload = { _id: code._id, code: code.code };
                const jwt = { event: 'code/generate', data: { success: true, token: this.jwtService.sign(payload), code: newCode.code } };
                returnValue = jwt;
            })
            .catch((error) => {
                if (error.code !== 11000) {
                    console.log(error);
                }
                returnValue = { event: 'code/generate', data: { success: false } };
            });

        return returnValue;
    }

    @SubscribeMessage('code/login')
    handleLogin(client: Socket, data: string): WsResponse<any> {
        return { event: 'changeMe', data: data };
    }

    @SubscribeMessage('code/check')
    handleCheck(client: Socket, data: string): WsResponse<any> {

        return { event: 'changeME', data: data };
    }

    async findByCode(code): Promise<Code> {
        const savedCode = await this.codeModel.findById(code).exec();

        return savedCode;
    }
}
