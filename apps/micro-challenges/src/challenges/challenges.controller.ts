import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AcknowledgementEmitter } from '../shared/acknowledgement.emitter';
import { ChallengesService } from './challenges.service';
import { Challenge } from './interfaces/Challenge.interface';
import { Match } from '../matches/interfaces/Match.interface';

@Controller()
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @EventPattern('create-challenge')
  async createChallenge(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.logger.log(`Challenge: ${JSON.stringify(challenge)}`);
    try {
      await this.challengesService.createChallenge(challenge);
      await AcknowledgementEmitter.emit(context);
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }

  @MessagePattern('list-challenges')
  async listAllChallenges(@Ctx() context: RmqContext): Promise<Challenge[]> {
    const challenges = await this.challengesService.listChallenges();
    await AcknowledgementEmitter.emit(context);
    return challenges;
  }

  @MessagePattern('find-challenge')
  async findChallenge(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<Challenge> {
    const challenge = await this.challengesService.findChallengeById(id);
    await AcknowledgementEmitter.emit(context);
    return challenge;
  }

  @MessagePattern('find-challenge-by-player')
  async findByPlayerId(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<Challenge[]> {
    const challenges = await this.challengesService.findByPlayerId(id);
    await AcknowledgementEmitter.emit(context);
    return challenges;
  }

  @EventPattern('update-challenge')
  async updateChallenge(
    @Payload() data: { id: string; challenge: Challenge },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      const { id, challenge } = data;
      await this.challengesService.updateChallenge(id, challenge);
      await AcknowledgementEmitter.emit(context);
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }

  @MessagePattern('delete-challenge')
  async deleteChallenge(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      await this.challengesService.deleteChallenge(id);
      await AcknowledgementEmitter.emit(context);
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }

  @EventPattern('add-result-to-match')
  async updateChallengeMatch(
    @Payload() data: { id: string; match: Match },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      const { id, match } = data;
      await this.challengesService.addMatchByChallengeId(id, match);
      await AcknowledgementEmitter.emit(context);
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }

  @MessagePattern('list-completed-challenges')
  async listCompletedChallenges(
    @Payload() data: { categoryId: string; refDate: string },
    @Ctx() context: RmqContext,
  ): Promise<Challenge[]> {
    try {
      const { categoryId, refDate } = data;
      let challenges: Challenge[];

      refDate
        ? (challenges =
            await this.challengesService.listCompletedChallengesByDate(
              categoryId,
              refDate,
            ))
        : (challenges = await this.challengesService.listCompletedChallenges(
            categoryId,
          ));
      await AcknowledgementEmitter.emit(context);
      return challenges;
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }
}
