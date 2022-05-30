import 'fake-indexeddb/auto';
import { random } from 'lodash';

import { FreeCellDatabase, GameResultStatus } from './FreeCellDatabase';
import GameResult from './GameResult';
import GameStatistics from './GameStatistics';

const { objectContaining } = expect;

describe('db tests', () => {
  beforeEach(async () => {
    await FreeCellDatabase.getDb().open();
  });

  afterEach(async () => {
    await FreeCellDatabase.getDb().delete();
  });

  test('add gameResult', async () => {
    const gameNum = 1;
    const gameResult = new GameResult(
      gameNum,
      0,
      0,
      GameResultStatus.NOT_COMPLETED,
    );
    const savedGameResult = await gameResult.save();
    expect(savedGameResult.id).toBeDefined();
    expect(savedGameResult.id).not.toBeNull();
    expect(savedGameResult.gameNum).toEqual(gameNum);
    expect(savedGameResult.gameNum).toEqual(gameResult.gameNum);
    expect(savedGameResult.moveCount).toEqual(gameResult.moveCount);
    expect(savedGameResult.elapsedTime).toEqual(gameResult.elapsedTime);

    const byId = await GameResult.get(savedGameResult.id!);
    expect(byId).toBeInstanceOf(GameResult);
    expect(byId).toStrictEqual((savedGameResult));

    const byGameNum = await GameResult.getByGameNum(gameNum);
    expect(byGameNum).toBeDefined();
    expect(byGameNum).not.toBeNull();
    expect(byGameNum).toBeInstanceOf(GameResult);
    expect(byGameNum).toEqual(objectContaining(savedGameResult));
  });

  test('update gameResult', async () => {
    // game initiated
    const gameNum = 101;
    const gameResult = new GameResult(
      gameNum,
      0,
      0,
      GameResultStatus.NOT_COMPLETED,
    );
    await gameResult.save();

    // game won
    let byGameNumI = await GameResult.getByGameNum(gameNum);
    expect(byGameNumI).toBeInstanceOf(GameResult);
    const byGameNum = <GameResult>byGameNumI;
    byGameNum.status = GameResultStatus.WON;
    byGameNum.moveCount = 50;
    byGameNum.elapsedTime = 1000;
    await byGameNum.save();
    byGameNumI = await GameResult.getByGameNum(gameNum);
    expect(byGameNumI).toBeInstanceOf(GameResult);
    expect(byGameNumI!.status).toEqual(GameResultStatus.WON);
    expect(byGameNumI!.moveCount).toEqual(50);
    expect(byGameNumI!.elapsedTime).toEqual(1000);
  });

  test('statistics', async () => {
    // insert 100 game results
    const gameResults = [];
    for (let index = 0; index < 100; index += 1) {
      const obj = new GameResult(
        index + 1,
        random(1000, 99999),
        random(50, 200),
        index < 50 ? GameResultStatus.WON : GameResultStatus.LOST,
      );
      gameResults.push(obj);
    }
    await GameResult.bulkAdd(gameResults);
    const count = await GameResult.count();
    expect(count).toBe(gameResults.length);

    const statistics = await GameStatistics.get();
    // console.log(statistics);
    expect(statistics).toBeInstanceOf(GameStatistics);
  });
});
