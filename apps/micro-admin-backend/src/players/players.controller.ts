import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Category } from '../categories/interfaces/Category.interface';
import { AcknowledgementEmitter } from '../shared/acknowledgement.emitter';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller()
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  private readonly logger = new Logger(PlayersController.name);

  @EventPattern('create-player')
  async createPlayer(
    @Payload() data: { player: Player; category: string },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const { player, category } = data;

    this.logger.log(`Player: ${JSON.stringify(player)}`);

    try {
      await this.playersService.createPlayer(player, category);
      await AcknowledgementEmitter.emit(context);
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }

  @MessagePattern('list-players')
  async listAllPlayers(@Ctx() context: RmqContext): Promise<Player[]> {
    const players = await this.playersService.listPlayers();
    await AcknowledgementEmitter.emit(context);
    return players;
  }

  @MessagePattern('find-player')
  async findPlayerById(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<Player> {
    const player = await this.playersService.findPlayerById(id);
    await AcknowledgementEmitter.emit(context);
    return player;
  }

  @EventPattern('update-player')
  async updatePlayer(
    @Payload() data: { id: string; player: Player },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      const { id, player } = data;
      await this.playersService.updatePlayer(id, player);
      await AcknowledgementEmitter.emit(context);
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }

  @MessagePattern('delete-player')
  async deletePlayer(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<Player> {
    try {
      const player = await this.playersService.deletePlayer(id);
      await AcknowledgementEmitter.emit(context);
      return player;
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }
}
