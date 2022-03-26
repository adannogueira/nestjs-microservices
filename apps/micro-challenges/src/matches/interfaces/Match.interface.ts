import { Document } from 'mongoose';

export interface Match extends Document {
  category: string;
  challenge: string;
  winner: string;
  result: Result[];
  players: string[];
}

export interface Result {
  set: string;
}
