import { Injectable } from '@nestjs/common';
import { Match } from './interfaces/match.interface';
import { ExceptionLogger } from '../shared/exception.logger';
import { InjectModel } from '@nestjs/mongoose';
import { Ranking } from './interfaces/ranking.schema';
import { Model } from 'mongoose';
import { ClientProxyService } from '../proxyrmq/client-proxy';
import { Category } from './interfaces/category.interface';
import { lastValueFrom } from 'rxjs';
import { EventName } from './interfaces/events-name.enum';
import {
  RankingResponse,
  ranksByPlayer,
} from './interfaces/ranking-response.interface';
import * as momentTimezone from 'moment-timezone';
import * as _ from 'lodash';
import { Challenge } from './interfaces/challenge.interface';
@Injectable()
export class RankingsService {
  private category: Category;
  private matchId: string;
  private match: Match;
  private rankingLogs: Ranking[];

  constructor(
    @InjectModel('Ranking') private readonly rankingModel: Model<Ranking>,
    private clientProxy: ClientProxyService,
  ) {}

  private readonly logger = new ExceptionLogger(RankingsService.name);
  private clientAdminBackend = this.clientProxy.getAdminBackendInstance();
  private clientMicroChallenges = this.clientProxy.getChallengesInstance();

  async proccessMatch(matchId: string, match: Match) {
    this.matchId = matchId;
    this.match = match;
    try {
      await this.processMatchEvents();
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  async findRanking(
    categoryId: string,
    refDate: string,
  ): Promise<RankingResponse[]> {
    try {
      const date = this.getRefDate(refDate);
      await this.findRankingByCategory(categoryId);
      const challenges = await this.findChallengesByCategoryAndDate(
        categoryId,
        date,
      );
      this.filterRankingsByChallenges(challenges);
      const orderedRankings = this.orderRankingsByPlayer();
      return this.mountAllPlayersRankings(orderedRankings);
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  private async processMatchEvents(): Promise<void> {
    await this.getCategory(this.match.category);
    await this.processPlayers();
  }

  private async getCategory(categoryId: string): Promise<void> {
    const category$ = this.clientAdminBackend.send('find-category', categoryId);
    this.category = await lastValueFrom(category$);
  }

  private async processPlayers(): Promise<void> {
    const { players, winner } = this.match;
    players.forEach((player) => {
      player === winner
        ? this.proccessPlayer(EventName.VICTORY, player)
        : this.proccessPlayer(EventName.DEFEAT, player);
    });
  }

  private async proccessPlayer(result: string, player: string): Promise<void> {
    const ranking = new this.rankingModel();
    const event = this.category.events.find((event) => event.name === result);
    ranking.category = this.category._id;
    ranking.challenge = this.match.challenge;
    ranking.match = this.matchId;
    ranking.player = player;
    ranking.event = event.name;
    ranking.points = event.value;
    ranking.operation = event.operation;
    await ranking.save();
  }

  private getRefDate(date: string): string {
    return date
      ? date
      : momentTimezone().tz('America/Sao_Paulo').format('YYYY-MM-DD');
  }

  private async findRankingByCategory(categoryId: string): Promise<void> {
    this.rankingLogs = await this.rankingModel
      .find()
      .where('category')
      .equals(categoryId)
      .exec();
  }

  private async findChallengesByCategoryAndDate(
    categoryId: string,
    date: string,
  ): Promise<Challenge[]> {
    const challenges$ = this.clientMicroChallenges.send(
      'list-completed-challenges',
      {
        categoryId,
        refDate: date,
      },
    );
    return (await lastValueFrom(challenges$)) as Challenge[];
  }

  private filterRankingsByChallenges(challenges: Challenge[]): void {
    _.remove(this.rankingLogs, (item) => {
      const foundChallenges = challenges.filter(
        (challenge) => challenge._id === item.challenge.toString(),
      );
      return foundChallenges.length === 0;
    });
  }

  private orderRankingsByPlayer(): ranksByPlayer[] {
    const ranksByPlayer = _(this.rankingLogs)
      .groupBy('player')
      .map((items, key) => ({
        player: key,
        history: _.countBy(items, 'event'),
        points: _.sumBy(items, 'points'),
      }))
      .value();

    return _.orderBy(ranksByPlayer, 'points', 'desc');
  }

  mountAllPlayersRankings(orderedRanks: ranksByPlayer[]): RankingResponse[] {
    return orderedRanks.map((item, index) => {
      return {
        player: item.player,
        rank: ++index,
        points: item.points,
        matchHistory: {
          wins: item.history.vitoria || 0,
          losses: item.history.derrota || 0,
        },
      };
    });
  }
}
