import Dexie, { DexieOptions } from 'dexie';

export class FreeCellDatabase extends Dexie {
  results!: Dexie.Table<IGameResult, number>;

  private static instance?: FreeCellDatabase;

  constructor(options?: DexieOptions) {
    super('freecell-db', options);
    this.version(1).stores({
      results: '++id,&gameNum,elapsedTime,moveCount,status',
    });
    // this.results.mapToClass(GameResult);
  }

  static getDb(): FreeCellDatabase {
    if (!this.instance) {
      this.instance = new FreeCellDatabase();
    }
    return this.instance;
  }
}

export interface IGameResult {
  id?: number;
  gameNum: number;
  elapsedTime: number;
  moveCount: number;
  status: GameResultStatus;
}

export enum GameResultStatus {
  WON = 1,
  LOST = -1,
  NOT_COMPLETED = 0,
}
