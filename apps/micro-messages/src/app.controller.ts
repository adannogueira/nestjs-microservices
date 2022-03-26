import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Challenge } from './interfaces/Challenge.interface';
import { AcknowledgementEmitter } from './shared/acknowledgement.emitter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('new-challenge-note')
  async sendChallengeeMail(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      const note = await this.appService.sendChallengeeMail(challenge);
      await AcknowledgementEmitter.emit(context);
      return note;
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }
}
