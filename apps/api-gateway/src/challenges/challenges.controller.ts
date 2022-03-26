import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ParametersValidator } from '../common/pipes/parameters-validator.pipe';
import { ChallengesService } from './challenges.service';
import { AddMatchToChallenge } from './dtos/add-match-to-challenge.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/Challenge.interface';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}

  private logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  createChallenge(@Body() createChallengeDto: CreateChallengeDto): void {
    this.logger.log(
      `Creating challenge on category${createChallengeDto.category}.`,
    );
    this.challengesService.createChallenge(createChallengeDto);
  }

  @Get()
  listChallenges(): Observable<any> {
    this.logger.log('Listing all challenges.');
    return this.challengesService.listChallenges();
  }

  @Get(':challengeId')
  findChallengeById(
    @Param('challengeId', ParametersValidator) challengeId: string,
  ): Observable<any> {
    this.logger.log(`Searching challenge by id: ${challengeId}.`);
    return this.findChallengeById(challengeId);
  }

  @Get('player/:playerId')
  async findChallengeByPlayerId(
    @Param('playerId', ParametersValidator) playerId: string,
  ): Promise<any> {
    this.logger.log(`Searching player's challenges, player id: ${playerId}.`);
    return await this.findChallengeByPlayerId(playerId);
  }

  @Put(':challengeId')
  @UsePipes(ValidationPipe)
  updateChallenge(
    @Body() updateChallengeDto: UpdateChallengeDto,
    @Param('challengeId', ParametersValidator) challengeId: string,
  ): void {
    this.logger.log(`Updating challenge of id: ${challengeId}.`);
    this.challengesService.updateChallenge(challengeId, updateChallengeDto);
  }

  @Delete(':challengeId')
  async deleteChallenge(
    @Param('challengeId', ParametersValidator) challengeId: string,
  ): Promise<Observable<Challenge>> {
    this.logger.log(`Deleting challenge of id: ${challengeId}.`);
    return await this.challengesService.deleteChallenge(challengeId);
  }

  @Post(':challengeId')
  @UsePipes(ValidationPipe)
  addMatchToChallenge(
    @Param('challengeId', ParametersValidator) challengeId: string,
    @Body() addMatchToChallengeDto: AddMatchToChallenge,
  ): void {
    this.logger.log(`Adding match data into challenge of id: ${challengeId}.`);
    this.challengesService.addMatchToChallenge(
      challengeId,
      addMatchToChallengeDto,
    );
  }
}
