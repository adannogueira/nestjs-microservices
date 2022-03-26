import { Module } from '@nestjs/common';
import { RMQModule } from '../client-proxy/rmq.module';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

@Module({
  imports: [RMQModule],
  controllers: [RankingsController],
  providers: [RankingsService],
})
export class RankingsModule {}
