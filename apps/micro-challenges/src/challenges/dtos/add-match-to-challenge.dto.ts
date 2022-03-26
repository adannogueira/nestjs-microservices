import { IsNotEmpty } from 'class-validator';
import { Result } from '../../matches/interfaces/Match.interface';

export class AddMatchToChallenge {
  @IsNotEmpty()
  winner: string;

  @IsNotEmpty()
  result: Result[];
}
