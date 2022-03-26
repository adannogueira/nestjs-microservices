import { Player } from '../../players/interfaces/player.interface';

export interface Category {
  readonly _id: string;
  readonly category: string;
  description: string;
  events: Event[];
  players: Player[];
}

export interface Event {
  name: string;
  operation: string;
  value: number;
}
