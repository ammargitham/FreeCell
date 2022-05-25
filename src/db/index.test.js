import Dexie from "dexie";
import indexedDB from "fake-indexeddb";
import IDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";
import { random } from "lodash";

import DatabaseManager from ".";
import GameResult from "./GameResult";

const { objectContaining } = expect;

describe("db tests", () => {
  /**
   * @type {DatabaseManager}
   */
  let dbManager;

  const initDB = () => {
    const db = new Dexie("TestDb", {
      indexedDB,
      IDBKeyRange,
    });
    dbManager = new DatabaseManager(db);
    dbManager.createStores();
  };

  const deleteDb = () => {
    if (!dbManager) {
      return;
    }
    dbManager.db.delete();
    dbManager = null;
  };

  beforeEach(() => {
    initDB();
  });

  afterEach(() => {
    deleteDb();
  });

  test("gameResult toObj", () => {
    const gameResult = new GameResult(null, 1, 10, 34, GameResult.Status.WON);
    expect(gameResult.toObj()).toStrictEqual({
      id: null,
      gameNum: 1,
      elapsedTime: 10,
      moveCount: 34,
      status: GameResult.Status.WON,
    });
  });

  test("add gameResult", async () => {
    const gameNum = 1;
    const gameResult = new GameResult(
      null,
      gameNum,
      0,
      0,
      GameResult.Status.NOT_COMPLETED,
    );
    const id = await dbManager.addGameResult(gameResult);
    const byId = await dbManager.getGameResultById(id);
    expect(byId).toBeInstanceOf(GameResult);
    let gameResultObj = gameResult.toObj();
    delete gameResultObj.id;
    expect(byId).toEqual(objectContaining(gameResultObj));

    const byGameNum = await dbManager.getGameResultByGameNum(gameNum);
    expect(byGameNum).toBeInstanceOf(GameResult);
    gameResultObj = gameResult.toObj();
    delete gameResultObj.id;
    expect(byGameNum).toEqual(objectContaining(gameResultObj));
  });

  test("update gameResult", async () => {
    // game initiated
    const gameNum = 101;
    const gameResult = new GameResult(
      null,
      gameNum,
      0,
      0,
      GameResult.Status.NOT_COMPLETED,
    );
    await dbManager.addGameResult(gameResult);

    // game won
    let byGameNum = await dbManager.getGameResultByGameNum(gameNum);
    byGameNum.status = GameResult.Status.WON;
    byGameNum.moveCount = 50;
    byGameNum.elapsedTime = 1000;
    await dbManager.updateGameResult(byGameNum);
    byGameNum = await dbManager.getGameResultByGameNum(gameNum);
    expect(byGameNum.status).toEqual(GameResult.Status.WON);
    expect(byGameNum.moveCount).toEqual(50);
    expect(byGameNum.elapsedTime).toEqual(1000);
  });

  test("statistics", async () => {
    // insert 100 game results
    const gameResults = [];
    for (let index = 0; index < 100; index++) {
      const obj = new GameResult(
        null,
        index + 1,
        random(1000, 99999),
        random(50, 200),
        index < 50 ? GameResult.Status.WON : GameResult.Status.LOST,
      ).toObj();
      delete obj.id;
      gameResults.push(obj);
    }
    await dbManager.bulkAddGameResults(gameResults);
    const count = await dbManager.countGameResults();
    expect(count).toBe(gameResults.length);

    const statistics = await dbManager.getGameResultStatistics();
    // console.log(statistics);
    expect(Object.keys(statistics)).toEqual([
      "total",
      "totalWon",
      "totalLost",
      "bestMoves",
      "bestTime",
    ]);
  });
});
