import { initialState } from "./index";
import {
  indexToCard,
  cardToIndex,
  canMoveOver,
  suits,
  getStackFromCascade,
  canMoveToFoundation,
  getGameNumFromRandom,
  minGameNum,
  maxGameNum,
  generateNewGameState,
  getRandomCascades,
} from "./helper";

describe("helper tests", () => {
  test("random to game number", () => {
    const random = Math.random();
    const gameNum = getGameNumFromRandom(random);
    expect(gameNum).toBeGreaterThanOrEqual(minGameNum);
    expect(gameNum).toBeLessThanOrEqual(maxGameNum);

    // same random should generate same gameNumber
    const newGameNum = getGameNumFromRandom(random);
    expect(newGameNum).toBe(gameNum);
  });

  test("generate cascades", () => {
    const random = Math.random();
    const gameNum = getGameNumFromRandom(random);
    const cascades = getRandomCascades(gameNum);

    expect(cascades.length).toBe(8);
    expect(cascades.map((c) => c.length)).toStrictEqual([
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
    ]);

    // same gameNum should generate same cascades
    const newCascades = getRandomCascades(gameNum);
    expect(newCascades).toStrictEqual(cascades);
  });

  test("generate new game state", () => {
    const newGameState = generateNewGameState(initialState);
    const gameNum = newGameState.gameNum;
    expect(gameNum).toBeGreaterThanOrEqual(minGameNum);
    expect(gameNum).toBeLessThanOrEqual(maxGameNum);

    // same gameNum should generate same game state
    const sameNumGameState = generateNewGameState(initialState, gameNum);
    expect(sameNumGameState).toStrictEqual(newGameState);
  });

  test("index to card", () => {
    expect(indexToCard(0)).toStrictEqual({
      suit: suits.CLUBS.name,
      rank: "ace",
      indexInSuit: 0,
    });
    expect(indexToCard(14)).toStrictEqual({
      suit: suits.DIAMONDS.name,
      rank: 2,
      indexInSuit: 1,
    });
    expect(indexToCard(19)).toStrictEqual({
      suit: suits.DIAMONDS.name,
      rank: 7,
      indexInSuit: 6,
    });
    expect(indexToCard(25)).toStrictEqual({
      suit: suits.DIAMONDS.name,
      rank: "king",
      indexInSuit: 12,
    });
    expect(indexToCard(36)).toStrictEqual({
      suit: suits.HEARTS.name,
      rank: "jack",
      indexInSuit: 10,
    });
  });

  test("card to index", () => {
    expect(
      cardToIndex({
        suit: suits.CLUBS.name,
        rank: "ace",
      }),
    ).toBe(0);
    expect(
      cardToIndex({
        suit: suits.DIAMONDS.name,
        rank: 2,
      }),
    ).toBe(14);
    expect(
      cardToIndex({
        suit: suits.DIAMONDS.name,
        rank: "king",
        indexInSuit: 12,
      }),
    ).toBe(25);
  });

  test("can move over", () => {
    expect(canMoveOver(null, 0)).toBe(false);

    expect(canMoveOver(0, 0)).toBe(false);

    expect(canMoveOver(0, null)).toBe(true);

    let fromCard = {
      suit: suits.DIAMONDS.name,
      rank: 9,
    };
    let toCard = {
      suit: suits.SPADES.name,
      rank: 10,
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(true);

    fromCard = {
      suit: suits.SPADES.name,
      rank: 9,
    };
    toCard = {
      suit: suits.DIAMONDS.name,
      rank: 10,
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(true);

    fromCard = {
      suit: suits.DIAMONDS.name,
      rank: 9,
    };
    toCard = {
      suit: suits.HEARTS.name,
      rank: 10,
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(false);

    fromCard = {
      suit: suits.DIAMONDS.name,
      rank: 8,
    };
    toCard = {
      suit: suits.SPADES.name,
      rank: 10,
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(false);

    fromCard = {
      suit: suits.SPADES.name,
      rank: 10,
    };
    toCard = {
      suit: suits.DIAMONDS.name,
      rank: "jack",
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(true);

    fromCard = {
      suit: suits.SPADES.name,
      rank: 4,
    };
    toCard = {
      suit: suits.CLUBS.name,
      rank: 4,
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(false);
  });

  test("get stack from cascade", () => {
    let cascade = [
      {
        suit: suits.SPADES.name,
        rank: "queen",
      },
      {
        suit: suits.SPADES.name,
        rank: "king",
      },
      {
        suit: suits.DIAMONDS.name,
        rank: 4,
      },
      {
        suit: suits.SPADES.name,
        rank: 3,
      },
    ].map(cardToIndex);

    let stack = getStackFromCascade(cascade);

    let expectedStack = [
      {
        suit: suits.DIAMONDS.name,
        rank: 4,
      },
      {
        suit: suits.SPADES.name,
        rank: 3,
      },
    ].map(cardToIndex);
    expect(stack).toStrictEqual(expectedStack);

    cascade = [
      {
        suit: suits.SPADES.name,
        rank: "queen",
      },
      {
        suit: suits.SPADES.name,
        rank: "king",
      },
      {
        suit: suits.DIAMONDS.name,
        rank: 2,
      },
      {
        suit: suits.SPADES.name,
        rank: 3,
      },
    ].map(cardToIndex);

    stack = getStackFromCascade(cascade);

    expectedStack = [
      {
        suit: suits.SPADES.name,
        rank: 3,
      },
    ].map(cardToIndex);
    expect(stack).toStrictEqual(expectedStack);

    cascade = [];
    stack = getStackFromCascade(cascade);
    expectedStack = [];
    expect(stack).toStrictEqual(expectedStack);
  });

  test("get target foundation index", () => {
    let foundations = Array.from({ length: 4 });
    let card = cardToIndex({
      suit: suits.CLUBS.name,
      rank: "ace",
    });
    let actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: 0,
      canMove: true,
      shouldMove: true,
    });

    foundations = [
      cardToIndex({
        suit: suits.CLUBS.name,
        rank: "ace",
      }),
      null,
      null,
      null,
    ];
    card = cardToIndex({
      suit: suits.DIAMONDS.name,
      rank: "ace",
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: 1,
      canMove: true,
      shouldMove: true,
    });

    foundations = [
      cardToIndex({
        suit: suits.CLUBS.name,
        rank: "ace",
      }),
      cardToIndex({
        suit: suits.DIAMONDS.name,
        rank: "ace",
      }),
      null,
      null,
    ];
    card = cardToIndex({
      suit: suits.HEARTS.name,
      rank: "ace",
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: 2,
      canMove: true,
      shouldMove: true,
    });

    // needs ace of same suit to be able to move
    foundations = Array.from({ length: 4 });
    card = cardToIndex({
      suit: suits.DIAMONDS.name,
      rank: 2,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: -1,
      canMove: false,
      shouldMove: false,
    });

    foundations = [
      cardToIndex({
        suit: suits.CLUBS.name,
        rank: "ace",
      }),
      null,
      null,
      null,
    ];
    card = cardToIndex({
      suit: suits.DIAMONDS.name,
      rank: 2,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: -1,
      canMove: false,
      shouldMove: false,
    });

    foundations = [
      cardToIndex({
        suit: suits.DIAMONDS.name,
        rank: "ace",
      }),
      null,
      null,
      null,
    ];
    card = cardToIndex({
      suit: suits.DIAMONDS.name,
      rank: 2,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: 0,
      canMove: true,
      shouldMove: true,
    });

    foundations = [
      cardToIndex({
        suit: suits.CLUBS.name,
        rank: "ace",
      }),
      cardToIndex({
        suit: suits.DIAMONDS.name,
        rank: "ace",
      }),
      cardToIndex({
        suit: suits.SPADES.name,
        rank: "ace",
      }),
      null,
    ];
    card = cardToIndex({
      suit: suits.DIAMONDS.name,
      rank: 2,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: 1,
      canMove: true,
      shouldMove: true,
    });

    foundations = [
      cardToIndex({
        suit: suits.DIAMONDS.name,
        rank: "ace",
      }),
      null,
      null,
      null,
    ];
    card = cardToIndex({
      suit: suits.DIAMONDS.name,
      rank: 3,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: -1,
      canMove: false,
      shouldMove: false,
    });

    foundations = [
      cardToIndex({
        suit: suits.DIAMONDS.name,
        rank: 2,
      }),
      null,
      null,
      null,
    ];
    card = cardToIndex({
      suit: suits.DIAMONDS.name,
      rank: 3,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: 0,
      canMove: true,
      shouldMove: false,
    });
  });
});
