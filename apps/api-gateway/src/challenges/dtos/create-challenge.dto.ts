import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Player } from '../../players/interfaces/player.interface';

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  readonly challengeTime: Date;

  @IsNotEmpty()
  readonly challenger: string;

  @IsNotEmpty()
  readonly category: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  readonly players: Player[];
}
