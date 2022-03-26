import { Player } from '../../players/interfaces/player.interface';

export interface Match extends Document {
  category?: string;
  challenge?: string;
  winner?: Player;
  result?: Result[];
  players?: Player[];
}

export interface Result {
  set: string;
}
