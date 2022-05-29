export class GameResult {
  id: number | null;

  gameNum: number;

  elapsedTime: number;

  moveCount: number;

  status: GameResult.Status;

  constructor(
    id: number | null,
    gameNum: number,
    elapsedTime: number,
    moveCount: number,
    status: GameResult.Status,
  ) {
    this.id = id;
    this.gameNum = gameNum;
    this.elapsedTime = elapsedTime;
    this.moveCount = moveCount;
    this.status = status;
  }

  toObj() {
    return { ...this };
  }
}

export namespace GameResult {
  export enum Status {
    WON = 1,
    LOST = -1,
    NOT_COMPLETED = 0,
  }
}

export default GameResult;
