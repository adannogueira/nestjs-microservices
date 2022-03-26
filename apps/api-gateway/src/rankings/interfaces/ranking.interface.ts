export interface Ranking {
  readonly _id: string;
  challenge: string;
  player: string;
  match: string;
  category: string;
  event: string;
  operation: string;
  points: number;
}
