import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { ClientProxyService } from '../proxyrmq/client-proxy';
import { ExceptionLogger } from '../shared/exception.logger';
import { Match } from './interfaces/Match.interface';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private clientProxy: ClientProxyService,
  ) {}

  private readonly logger = new ExceptionLogger(MatchesService.name);
  private clientMicroRankings = this.clientProxy.getRankingsInstance();

  async createMatch(match: Match): Promise<Match> {
    try {
      let createdMatch = new this.matchModel(match);
      createdMatch = await createdMatch.save();

      await this.proccessMatch(createdMatch);

      return createdMatch;
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  private async proccessMatch(match: Match): Promise<any> {
    try {
      const processed$ = this.clientMicroRankings.emit('proccess-match', {
        matchId: match._id,
        match,
      });
      const processed = await lastValueFrom(processed$);
      return processed;
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }
}
