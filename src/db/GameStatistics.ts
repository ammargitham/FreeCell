export default class GameStatistics {
  total: number;

  totalWon: number;

  totalLost: number;

  bestMoves: number;

  bestTime: number;

  constructor(
    total: number,
    totalWon: number,
    totalLost: number,
    bestMoves: number,
    bestTime: number,
  ) {
    this.total = total;
    this.totalWon = totalWon;
    this.totalLost = totalLost;
    this.bestMoves = bestMoves;
    this.bestTime = bestTime;
  }
}
