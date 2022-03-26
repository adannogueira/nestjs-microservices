import { ChallengeStatus } from './challenge-status.enum';

export interface Challenge {
  _id: string;
  challengeTime: Date;
  status: ChallengeStatus;
  requestTime: Date;
  responseTime: Date;
  challenger: string;
  category: string;
  players: string[];
  match?: string;
}
