import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';
import { AwsS3Service } from '../aws/awss3.service';
import { Category } from '../categories/interfaces/Category.interface';
import { ClientProxyService } from '../client-proxy/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    private clientProxy: ClientProxyService,
    private awsService: AwsS3Service,
  ) {}

  private clientAdminBackend = this.clientProxy.getAdminBackendInstance();

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { category } = createPlayerDto;

    await this.findCategory(category);

    this.clientAdminBackend.emit('create-player', {
      player: createPlayerDto,
      category,
    });
  }

  findPlayerById(playerId: string): Observable<Player> {
    return this.clientAdminBackend.send('find-player', playerId);
  }

  listAllPlayers(): Observable<Player[]> {
    return this.clientAdminBackend.send('list-players', '');
  }

  async updatePlayer(playerId: string, player: UpdatePlayerDto): Promise<void> {
    const { category } = player;

    if (category) await this.findCategory(category);

    this.clientAdminBackend.emit('update-player', {
      playerId,
      player,
    });
  }

  deletePlayer(playerId: string): Observable<Player> {
    return this.clientAdminBackend.send('delete-player', playerId);
  }

  async addPlayerAvatar(
    playerId: string,
    file: object,
  ): Promise<Observable<Player>> {
    /**
     * S3 file sending proccess:
     * =========================
     * 1 Verify player existence
     * 2 Send file to S3 and recover URL
     * 3 Update URL on player entity
     * 4 Return updated player instance
     */
    const foundPlayer$ = this.clientAdminBackend.send('find-player', playerId);
    const foundPlayer = await lastValueFrom(foundPlayer$);

    if (!foundPlayer) throw new NotFoundException('Player not found');

    const data = await this.awsService.uploadFile(file, playerId);
    await this.clientAdminBackend.emit('update-player', {
      id: playerId,
      player: { photoUrl: data.url },
    });

    return this.clientAdminBackend.send('find-player', playerId);
  }

  private async findCategory(categoryId: string): Promise<Category> {
    const category$ = this.clientAdminBackend.send(
      'find-category',
      categoryId,
    ) as Observable<Category>;
    const category = await lastValueFrom(category$);

    if (!category) throw new BadRequestException('Invalid category');

    return category;
  }
}
