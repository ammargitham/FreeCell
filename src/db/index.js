import Dexie from 'dexie';
import GameResult from './GameResult';
import GameStatistics from './GameStatistics';

export default class DatabaseManager {
  /**
   *
   * @param {Dexie} db
   */
  constructor(db) {
    this.db = db;
    if (!this.db) {
      this.db = new Dexie('freecell-db');
    }
    this.createStores();
  }

  createStores() {
    this.db.version(1).stores({
      results: '++id,gameNum,elapsedTime,moveCount,status',
    });
    this.db.results.mapToClass(GameResult);
  }

  /**
   * Get game result by id
   * @param {int} id ID of game result
   * @returns {Promise<GameResult>} The game result object
   */
  async getGameResultById(id) {
    if (!this.db || !id) {
      return null;
    }
    const gameResult = await this.db.results.get(id);
    return gameResult;
  }

  /**
   * Get game result by game number
   * @param {int} gameNum Number of game
   * @returns {Promise<GameResult>} Promise which resolves to the game result object
   */
  async getGameResultByGameNum(gameNum) {
    if (!this.db || !gameNum) {
      return null;
    }
    const gameResult = await this.db.results.where('gameNum').equals(gameNum).first();
    return gameResult;
  }

  /**
   * Get total count of game results
   * @returns {Promise<int>} Promise which resolves to the count of game result objects
   */
  async countGameResults() {
    if (!this.db) {
      return 0;
    }
    const count = await this.db.results.count();
    return count;
  }

  /**
   * Get game result statistics
   * @returns {Promise<GameStatistics>} Promise resolving to the game statistics
   */
  async getGameResultStatistics() {
    if (!this.db) {
      return null;
    }
    const total = await this.db.results.count();
    const totalWon = await this.db.results
      .where('status')
      .equals(GameResult.Status.WON)
      .count();
    const totalLost = await this.db.results
      .where('status')
      .equals(GameResult.Status.LOST)
      .count();
    const bestMoveResult = await this.db.results.orderBy('moveCount').first();
    const bestMoves = bestMoveResult ? bestMoveResult.moveCount : 0;
    const bestTimeResult = await this.db.results.orderBy('elapsedTime').first();
    const bestTime = bestTimeResult ? bestTimeResult.elapsedTime : 0;
    return new GameStatistics(total, totalWon, totalLost, bestMoves, bestTime);
  }

  /**
   * Adds the game result to db
   * @param {GameResult} gameResult
   * @returns {Promise<int>} Promise which resolves to the primary key of the inserted GameResult
   */
  async addGameResult(gameResult) {
    if (!this.db || !gameResult) {
      return null;
    }
    const obj = gameResult.toObj();
    delete obj.id;
    const id = await this.db.results.add(obj);
    return id;
  }

  /**
   * Adds the game result to db
   * @param {GameResult[]} gameResult Array of game results to add
   * @returns {Promise<void>} Promise which resolves when objects are inserted
   */
  async bulkAddGameResults(gameResults) {
    if (!this.db || !gameResults) {
      return;
    }
    await this.db.results.bulkAdd(gameResults);
  }

  /**
   * Adds or update the game result in db
   * @param {GameResult} gameResult
   * @returns {Promise<int>} Promise which resolves to the primary key of the inserted GameResult
   */
  async addOrUpdateGameResultByGameNum(gameResult) {
    if (!this.db || !gameResult) {
      return null;
    }
    // check gameNum exists
    const existing = await this.getGameResultByGameNum(gameResult.gameNum);
    let id = null;
    if (existing) {
      id = existing.id;
    }
    if (id === null) {
      id = await this.addGameResult(gameResult);
      return id;
    }
    const newGameResult = new GameResult(
      id,
      gameResult.gameNum,
      gameResult.elapsedTime,
      gameResult.moveCount,
      gameResult.status,
    );
    await this.updateGameResult(newGameResult);
    return id;
  }

  /**
   * Update the game result in db
   * @param {GameResult} gameResult The GameResult object to update. Should contain valid id.
   * @returns {Promise<undefined>}
   */
  async updateGameResult(gameResult) {
    if (!this.db || !gameResult || !gameResult.id) {
      return;
    }
    await this.db.results.put(gameResult.toObj(), gameResult.id);
  }

  close() {
    if (!this.db) {
      return;
    }
    this.db.close();
  }
}

export const dbManager = new DatabaseManager();
