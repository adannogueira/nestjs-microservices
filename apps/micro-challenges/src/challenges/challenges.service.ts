import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatchesService } from '../matches/matches.service';
import { ExceptionLogger } from '../shared/exception.logger';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge } from './interfaces/Challenge.interface';
import { Match } from '../matches/interfaces/Match.interface';
import * as momentTimezone from 'moment-timezone';
import { ClientProxyService } from '../proxyrmq/client-proxy';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly matchesService: MatchesService,
    private readonly clientProxy: ClientProxyService,
  ) {}

  private readonly logger = new ExceptionLogger(ChallengesService.name);
  private clientMessages = this.clientProxy.getMessagesInstance();

  async createChallenge(challenge: Challenge): Promise<Challenge> {
    try {
      const createdChallenge = new this.challengeModel(challenge);
      createdChallenge.status = ChallengeStatus.Pending;
      await createdChallenge.save();
      const note$ = this.clientMessages.emit('new-challenge-note', challenge);
      return await lastValueFrom(note$);
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  async listChallenges(): Promise<Challenge[]> {
    return await this.challengeModel.find().exec();
  }

  async findChallengeById(id: string): Promise<Challenge> {
    return await this.find(id);
  }

  async findByPlayerId(playerId: string): Promise<Challenge[]> {
    const challenges = await this.listChallenges();

    const playerChallenges = challenges.filter((challenge) => {
      return challenge.players.filter((player) => player === playerId);
    });

    if (!playerChallenges.length)
      throw new NotFoundException('Player is not in any challenge.');

    return playerChallenges;
  }

  async updateChallenge(id: string, challenge: Challenge): Promise<void> {
    const foundChallenge = await this.find(id);

    try {
      challenge.responseTime = new Date();
      await foundChallenge.updateOne(challenge).exec();
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  async deleteChallenge(id: string): Promise<void> {
    const challenge = await this.find(id);
    challenge.responseTime = new Date();

    try {
      await challenge.updateOne({ status: ChallengeStatus.Denied }).exec();
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  async addMatchByChallengeId(id: string, match: Match): Promise<Challenge> {
    const foundChallenge = await this.find(id);

    try {
      match.category = foundChallenge.category;
      match.challenge = id;
      match.players = foundChallenge.players;
      const newMatch = await this.matchesService.createMatch(match);
      return await foundChallenge
        .updateOne({ match: newMatch._id, status: ChallengeStatus.Completed })
        .exec();
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  async listCompletedChallenges(categoryId: string): Promise<Challenge[]> {
    try {
      return this.challengeModel
        .find()
        .where('category')
        .equals(categoryId)
        .where('status')
        .equals(ChallengeStatus.Completed)
        .exec();
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  async listCompletedChallengesByDate(
    categoryId: string,
    refDate: string,
  ): Promise<Challenge[]> {
    try {
      refDate = `${refDate} 23:59:59.999`;
      return this.challengeModel
        .find()
        .where('category')
        .equals(categoryId)
        .where('challengeTime')
        .lte(
          momentTimezone(refDate)
            .tz('UTC')
            .format('YYYY-MM-DD HH:mm:ss.SSS+00:00'),
        )
        .exec();
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  private async find(id: string): Promise<Challenge> {
    const challenge = await this.challengeModel.findById(id).exec();

    if (!challenge) throw new NotFoundException('Challenge not found.');

    return challenge;
  }
}
