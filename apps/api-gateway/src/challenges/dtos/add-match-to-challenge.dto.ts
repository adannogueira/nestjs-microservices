import { IsNotEmpty } from 'class-validator';
import { Result } from '../interfaces/Match.interface';

export class AddMatchToChallenge {
  @IsNotEmpty()
  winner: string;

  @IsNotEmpty()
  result: Result[];
}
