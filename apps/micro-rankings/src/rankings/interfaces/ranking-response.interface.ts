export interface RankingResponse {
  player?: string;
  rank?: number;
  points?: number;
  matchHistory?: History;
}

export interface History {
  wins?: number;
  losses?: number;
}

export interface ranksByPlayer {
  player: string;
  history: _.Dictionary<number>;
  points: number;
}
