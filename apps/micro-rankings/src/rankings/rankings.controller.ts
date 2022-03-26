import { Logger } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AcknowledgementEmitter } from '../shared/acknowledgement.emitter';
import { Match } from './interfaces/match.interface';
import { RankingResponse } from './interfaces/ranking-response.interface';
import { RankingsService } from './rankings.service';

@Controller()
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  private readonly logger = new Logger(RankingsController.name);

  @EventPattern('proccess-match')
  async proccessMatch(
    @Payload() data: { matchId: string; match: Match },
    @Ctx() context: RmqContext,
  ) {
    try {
      const { matchId, match } = data;
      await this.rankingsService.proccessMatch(matchId, match);
      await AcknowledgementEmitter.emit(context);
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }

  @MessagePattern('find-ranking')
  async findRanking(
    @Payload() data: { categoryId: string; refDate: string },
    @Ctx() context: RmqContext,
  ): Promise<RankingResponse[]> {
    try {
      const { categoryId, refDate } = data;
      const ranking = await this.rankingsService.findRanking(
        categoryId,
        refDate,
      );
      await AcknowledgementEmitter.emit(context);
      return ranking;
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }
}
