class GameResult {
  constructor(id, gameNum, elapsedTime, moveCount, status) {
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

GameResult.Status = {
  WON: 1,
  LOST: -1,
  NOT_COMPLETED: 0,
};

export default GameResult;
