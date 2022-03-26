import { Module } from '@nestjs/common';
import { AwsModule } from '../aws/aws.module';
import { CategoriesModule } from '../categories/categories.module';
import { RMQModule } from '../client-proxy/rmq.module';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  controllers: [PlayersController],
  imports: [RMQModule, CategoriesModule, AwsModule],
  providers: [PlayersService],
})
export class PlayersModule {}
