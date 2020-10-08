import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {

    generateCode(length) {
        return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
    }

    getFileExtension(fileName){
        const split = fileName.split('.');
        return split[split.length-1]
    }
    makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
