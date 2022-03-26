import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxyService } from './client-proxy/client-proxy';
import { Challenge } from './interfaces/Challenge.interface';
import { Player } from './interfaces/player.interface';
import { ExceptionLogger } from './shared/exception.logger';
import CHALLENGE_NOTIFICATION_HTML from './static/challenge-notification';

@Injectable()
export class AppService {
  constructor(
    private readonly clientProxy: ClientProxyService,
    private readonly mailService: MailerService,
  ) {}

  private readonly logger = new ExceptionLogger(AppService.name);
  private clientAdminBackend = this.clientProxy.getAdminBackendInstance();

  async sendChallengeeMail(challenge: Challenge): Promise<void> {
    try {
      const challengerId = challenge.challenger;
      const [{ _id: challengeeId }] = challenge.players.filter(
        (player) => player._id !== challengerId,
      );
      const challenger = await this.findPlayerById(challengerId);
      const challengee = await this.findPlayerById(challengeeId);
      const markup = this.createMessage(challenger, challengee);

      const sentMessage = await this.mailService.sendMail({
        to: challengee.email,
        from: `"API SMARTRANKING" <${process.env.EMAIL}>`,
        subject: 'Notificação de Desafio',
        html: markup,
      });
      return sentMessage;
    } catch (err) {
      console.log(err);
      this.logger.logAndThrowException(err);
    }
  }

  private async findPlayerById(playerId: string): Promise<Player> {
    const player$ = this.clientAdminBackend.send('find-player', playerId);
    const player = await firstValueFrom(player$);
    return player;
  }

  private createMessage(challenger: Player, challengee: Player): string {
    let markup = CHALLENGE_NOTIFICATION_HTML;
    markup = markup.replace(/#CHALLENGER_NAME/g, challenger.name);
    markup = markup.replace(/#CHALLENGEE_NAME/g, challengee.name);
    return markup;
  }
}
