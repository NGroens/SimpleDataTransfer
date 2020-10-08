import { IsEnum, IsNotEmpty } from 'class-validator';

export class SendFileDto {

    // @ts-ignore
    @IsEnum(BackendType)
    @IsNotEmpty()
    backendType: BackendType;
}

export enum BackendType {
    S3 = 'S3',
    LOCAL = 'LOCAL',
}
