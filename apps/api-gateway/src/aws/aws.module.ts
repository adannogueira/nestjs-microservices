import { Module } from '@nestjs/common';
import { AwsCognitoService } from './aws.cognito.service';
import { AwsS3Service } from './awss3.service';

@Module({
  providers: [AwsS3Service, AwsCognitoService],
  exports: [AwsS3Service, AwsCognitoService],
})
export class AwsModule {}
