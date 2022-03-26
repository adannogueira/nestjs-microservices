import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  private logger = new Logger(AwsS3Service.name);

  constructor(private configService: ConfigService) {}

  async uploadFile(file: any, id: string) {
    const s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
    });
    const fileExtension = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileExtension}`;
    this.logger.log(`urlKey: ${urlKey}`);

    const params = {
      Body: file.buffer,
      Bucket: process.env.AWS_S3_BUCKET,
      Key: urlKey,
    };

    try {
      await s3.putObject(params).promise();
      return {
        url: `${process.env.AWS_DEFAULT_URL}/${urlKey}`,
      };
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }
}
