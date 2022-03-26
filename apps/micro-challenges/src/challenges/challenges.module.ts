import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { MatchesModule } from '../matches/matches.module';
import { MongooseModule } from '@nestjs/mongoose';
import { challengeSchema } from './interfaces/Challenge.schema';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Challenge', schema: challengeSchema }]),
    MatchesModule,
    ProxyrmqModule,
  ],
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
