import { Document } from 'mongoose';
import { ChallengeStatus } from './challenge-status.enum';

export interface Challenge extends Document {
  challengeTime: Date;
  status: ChallengeStatus;
  requestTime: Date;
  responseTime?: Date;
  challenger: string;
  category: string;
  players: string[];
  match?: string;
}
