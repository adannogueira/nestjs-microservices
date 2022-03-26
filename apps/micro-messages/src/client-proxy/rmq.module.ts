import { Module } from '@nestjs/common';
import { ClientProxyService } from './client-proxy';

@Module({
  providers: [ClientProxyService],
  exports: [ClientProxyService],
})
export class RMQModule {}
