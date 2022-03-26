import { ChallengeStatus } from './challenge-status.enum';
import { Player } from './player.interface';

export interface Challenge {
  challengeTime: Date;
  status: ChallengeStatus;
  requestTime: Date;
  responseTime?: Date;
  challenger: string;
  category: string;
  players: Player[];
  match?: string;
}
