import { FreeCellDatabase, GameResultStatus, IGameResult } from './FreeCellDatabase';

const db = FreeCellDatabase.getDb();

export default class GameResult implements IGameResult {
  id?: number | undefined;

  gameNum: number;

  elapsedTime: number;

  moveCount: number;

  status: GameResultStatus;

  constructor(
    gameNum: number,
    elapsedTime: number,
    moveCount: number,
    status: GameResultStatus,
    id?: number,
  ) {
    this.gameNum = gameNum;
    this.elapsedTime = elapsedTime;
    this.moveCount = moveCount;
    this.status = status;
    this.id = id;
  }

  /**
   * Adds or updates this game result to db
   * @returns Inserted/updated GameResult
   */
  async save() {
    if (this.id) {
      // update
      await db.results.put(this, this.id);
      return this;
    }
    // add
    const id = await db.results.add(this);
    this.id = id;
    return this;
  }

  /**
   * Get game result by id
   * @param {number} id ID of game result
   * @returns The game result object
   */
  static async get(id: number) {
    const gameResult = await db.results.get(id);
    return gameResult;
  }

  /**
   * Get game result by game number
   * @param {number} gameNum Number of game
   * @returns Promise which resolves to the game result object
   */
  static async getByGameNum(gameNum: number) {
    const gameResult = await db.results.where('gameNum').equals(gameNum).first();
    return gameResult;
  }

  /**
   * Get total count of game results
   * @returns Promise which resolves to the count of game result objects
   */
  static async count(): Promise<number> {
    const c = await db.results.count();
    return c;
  }

  /**
   * Adds the game result to db
   * @param {GameResult[]} gameResults Array of game results to add
   * @returns Promise which resolves when objects are inserted
   */
  static async bulkAdd(gameResults: GameResult[]) {
    await db.results.bulkAdd(gameResults);
  }
}

db.results.mapToClass(GameResult);
