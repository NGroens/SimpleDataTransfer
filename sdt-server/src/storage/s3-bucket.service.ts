import { Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';

@Injectable()
export class S3BucketService {
    constructor(
        @InjectS3() private readonly s3: S3,
    ) {
    }

    /**
     *
     */
    async bucketExists(BUCKET_NAME) {
        try {
            const data = await this.s3.headBucket({ Bucket: BUCKET_NAME }).promise()
            return true;
        }
        catch (err) {
            if (err.statusCode >= 400 && err.statusCode < 500) {
               return false;
            }
            console.log(err);
            return false
        }
    }

}
