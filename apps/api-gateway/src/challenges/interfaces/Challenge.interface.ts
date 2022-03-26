import { Player } from '../../players/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';
import { Match } from './Match.interface';

export interface Challenge {
  challengeTime: Date;
  status: ChallengeStatus;
  requestTime: Date;
  responseTime: Date;
  challenger: Player;
  category: string;
  players: string[];
  match?: Match;
}
