import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { matchSchema } from './interfaces/Match.schema';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: matchSchema }]),
    ProxyrmqModule,
  ],
  exports: [MatchesService],
  providers: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
