import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { ExceptionLogger } from '../shared/exception.logger';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new ExceptionLogger(PlayersService.name);

  async createPlayer(player: Player, category: string): Promise<Player> {
    try {
      const { email } = player;
      const foundPlayer = await this.playerModel.findOne({ email }).exec();
      const foundCategory = await this.categoriesService.findCategoryById(
        category,
      );
      if (foundPlayer) throw new BadRequestException('Player already exists.');

      const newPlayer = new this.playerModel(player);

      foundCategory.players.push(newPlayer);

      await this.categoriesService.updateCategory(
        foundCategory._id,
        foundCategory,
      );

      return await newPlayer.save();
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  async listPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async findPlayerById(id: string): Promise<Player> {
    return await this.find(id);
  }

  async updatePlayer(id: string, player: Player): Promise<void> {
    const foundPlayer = await this.find(id);

    try {
      await foundPlayer.updateOne(player).exec();
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  async deletePlayer(id: string): Promise<Player> {
    const player = await this.find(id);

    return await player.deleteOne();
  }

  private async find(id: string): Promise<Player> {
    const player = await this.playerModel.findById(id).exec();

    if (!player) throw new NotFoundException('Player not found.');

    return player;
  }
}
