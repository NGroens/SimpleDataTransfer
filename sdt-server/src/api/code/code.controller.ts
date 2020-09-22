import { Controller, Get } from '@nestjs/common';
import { CodeService } from './code.service';

@Controller("/api")
export class CodeController {
    constructor(private readonly codeService: CodeService) {}

    @Get()
    getHello(): string {
        return this.codeService.getHello();
    }
}
