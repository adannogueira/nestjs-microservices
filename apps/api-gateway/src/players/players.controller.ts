import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { ParametersValidator } from '../common/pipes/parameters-validator.pipe';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  private logger = new Logger(PlayersController.name);

  @Post()
  @UsePipes(ValidationPipe)
  createPlayer(@Body() createPlayerDto: CreatePlayerDto): void {
    this.logger.log(
      `Creating player on category: ${createPlayerDto.category}.`,
    );
    this.playersService.createPlayer(createPlayerDto);
  }

  @Get(':playerId')
  @UseGuards(AuthGuard('jwt'))
  findPlayerById(
    @Param('playerId', ParametersValidator) playerId: string,
  ): Observable<Player> {
    this.logger.log(`Searching player of id: ${playerId}.`);
    return this.playersService.findPlayerById(playerId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  listAllPlayers(): Observable<Player[]> {
    this.logger.log('Listing all players.');
    return this.playersService.listAllPlayers();
  }

  @Put(':playerId')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'))
  updatePlayer(
    @Param('playerId', ParametersValidator) playerId: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): void {
    this.logger.log(`Updating player of id: ${playerId}.`);
    this.playersService.updatePlayer(playerId, updatePlayerDto);
  }

  @Delete(':playerId')
  @UseGuards(AuthGuard('jwt'))
  deletePlayer(
    @Param('playerId', ParametersValidator) playerId: string,
  ): Observable<Player> {
    this.logger.log(`Deleting player of id: ${playerId}`);
    return this.playersService.deletePlayer(playerId);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  async avatarUpload(
    @UploadedFile() file: object,
    @Param('id') playerId: string,
  ): Promise<Observable<Player>> {
    this.logger.log(`Adding avatar picture to player: ${playerId}`);
    return this.playersService.addPlayerAvatar(playerId, file);
  }
}
