import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeService {
    getHello(): string {
        return 'Hello World!';
    }
}
