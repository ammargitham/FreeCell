import { FreeCellDatabase, GameResultStatus } from './FreeCellDatabase';

const db = FreeCellDatabase.getDb();

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

  /**
   * Get game result statistics
   * @returns Promise resolving to the game statistics
   */
  static async get() {
    const total = await db.results.count();
    const totalWon = await db.results
      .where('status')
      .equals(GameResultStatus.WON)
      .count();
    const totalLost = await db.results
      .where('status')
      .equals(GameResultStatus.LOST)
      .count();
    const bestMoveResult = await db.results.orderBy('moveCount').first();
    const bestMoves = bestMoveResult ? bestMoveResult.moveCount : 0;
    const bestTimeResult = await db.results.orderBy('elapsedTime').first();
    const bestTime = bestTimeResult ? bestTimeResult.elapsedTime : 0;
    return new GameStatistics(total, totalWon, totalLost, bestMoves, bestTime);
  }
}
