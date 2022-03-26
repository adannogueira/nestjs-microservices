import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';
import { ClientProxyService } from '../client-proxy/client-proxy';
import { Player } from '../players/interfaces/player.interface';
import { AddMatchToChallenge } from './dtos/add-match-to-challenge.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge } from './interfaces/Challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(private clientProxy: ClientProxyService) {}

  private clientMicroChallenges = this.clientProxy.getChallengesInstance();
  private clientAdminBackend = this.clientProxy.getAdminBackendInstance();

  async createChallenge(createChallengeDto: CreateChallengeDto): Promise<void> {
    const { players, category, challenger } = createChallengeDto;
    const playerIds = players.map((player) => player._id);
    const playersInMatch = await Promise.all(
      playerIds.map(this.findPlayer, this),
    );

    if (!this.playersCategoryMatches(playersInMatch, category))
      throw new BadRequestException(
        'Both players must be in the challenge category',
      );

    if (!this.playerInMatch(challenger, playerIds))
      throw new BadRequestException('The challenger must be in the match');

    if (await !this.categoryExists(category))
      throw new NotFoundException('Category not found');

    this.clientMicroChallenges.emit('create-challenge', createChallengeDto);
  }

  listChallenges(): Observable<Challenge[]> {
    return this.clientMicroChallenges.send('list-challenges', '');
  }

  findChallengeById(challengeId: string): Observable<Challenge> {
    return this.clientMicroChallenges.send('find-challenge', challengeId);
  }

  async findChallengeByPlayerId(
    playerId: string,
  ): Promise<Observable<Challenge[]>> {
    await this.findPlayer(playerId);
    return this.clientMicroChallenges.send(
      'find-challenge-by-player',
      playerId,
    );
  }

  async updateChallenge(
    challengeId: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const foundChallenge = await this.findChallenge(challengeId);
    this.throwWhenChallengeIsNotPending(foundChallenge);
    this.clientMicroChallenges.emit('update-challenge', {
      id: challengeId,
      challenge: updateChallengeDto,
    });
  }

  async deleteChallenge(challengeId: string): Promise<Observable<Challenge>> {
    await this.findChallenge(challengeId);
    return this.clientMicroChallenges.send('delete-challenge', challengeId);
  }

  async addMatchToChallenge(
    challengeId: string,
    addMatchToChallengeDto: AddMatchToChallenge,
  ): Promise<void> {
    const foundChallenge = await this.findChallenge(challengeId);
    this.throwWhenChallengeIsNotAccepted(foundChallenge);
    const winner = this.playerInMatch(
      addMatchToChallengeDto.winner,
      foundChallenge.players,
    );

    if (!winner) throw new NotFoundException('Winner is not in the match');

    this.clientMicroChallenges.emit('add-result-to-match', {
      id: challengeId,
      match: addMatchToChallengeDto,
    });
  }

  private async findPlayer(playerId: string): Promise<Player> {
    const foundPlayer$ = this.clientAdminBackend.send('find-player', playerId);
    const foundPlayer = await lastValueFrom(foundPlayer$);

    if (!foundPlayer) throw new NotFoundException('Player not found');

    return foundPlayer;
  }

  private playersCategoryMatches(players: Player[], category: string): boolean {
    return players.every((player) => player.category === category);
  }

  private playerInMatch(player: string, playersInMatch: string[]): boolean {
    return playersInMatch.some((matchPlayer) => matchPlayer === player);
  }

  private async categoryExists(categoryId: string): Promise<boolean> {
    const foundCategory$ = this.clientAdminBackend.send(
      'find-category',
      categoryId,
    );
    const foundCategory = await lastValueFrom(foundCategory$);

    return Boolean(foundCategory);
  }

  private async findChallenge(challengeId: string): Promise<Challenge> {
    const foundChallenge$ = this.clientMicroChallenges.send(
      'find-challenge',
      challengeId,
    );
    const foundChallenge = (await lastValueFrom(foundChallenge$)) as Challenge;

    if (!foundChallenge) throw new NotFoundException('Challenge not found');

    return foundChallenge;
  }

  private throwWhenChallengeIsNotPending(challenge: Challenge): void {
    if (!(challenge.status === ChallengeStatus.Pending))
      throw new BadRequestException('Only pending challenges may be updated');
  }

  private throwWhenChallengeIsNotAccepted(challenge: Challenge): void {
    if (!(challenge.status === ChallengeStatus.Accepted))
      throw new BadRequestException(
        'A match can only be added to an accepted challenge',
      );
  }
}
