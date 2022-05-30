import { initialState } from './index';
import {
  indexToCard,
  cardToIndex,
  canMoveOver,
  getStackFromCascade,
  canMoveToFoundation,
  getGameNumFromRandom,
  minGameNum,
  maxGameNum,
  generateNewGameState,
  getRandomCascades,
} from './helper';
import {
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
  Card as CardType,
} from '../globals/types';

describe('helper tests', () => {
  test('random to game number', () => {
    const random = Math.random();
    const gameNum = getGameNumFromRandom(random);
    expect(gameNum).toBeGreaterThanOrEqual(minGameNum);
    expect(gameNum).toBeLessThanOrEqual(maxGameNum);

    // same random should generate same gameNumber
    const newGameNum = getGameNumFromRandom(random);
    expect(newGameNum).toBe(gameNum);
  });

  test('generate cascades', () => {
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

  test('generate new game state', () => {
    const { state: newGameState } = generateNewGameState(initialState);
    const { gameNum } = newGameState;
    expect(gameNum).toBeGreaterThanOrEqual(minGameNum);
    expect(gameNum).toBeLessThanOrEqual(maxGameNum);

    // same gameNum should generate same game state
    const { state: sameNumGameState } = generateNewGameState(initialState, gameNum);
    expect(sameNumGameState).toStrictEqual(newGameState);
  });

  test('index to card', () => {
    expect(indexToCard(0)).toStrictEqual({
      suit: CLUBS,
      rank: 'ace',
      indexInSuit: 0,
    });
    expect(indexToCard(14)).toStrictEqual({
      suit: DIAMONDS,
      rank: 2,
      indexInSuit: 1,
    });
    expect(indexToCard(19)).toStrictEqual({
      suit: DIAMONDS,
      rank: 7,
      indexInSuit: 6,
    });
    expect(indexToCard(25)).toStrictEqual({
      suit: DIAMONDS,
      rank: 'king',
      indexInSuit: 12,
    });
    expect(indexToCard(36)).toStrictEqual({
      suit: HEARTS,
      rank: 'jack',
      indexInSuit: 10,
    });
  });

  test('card to index', () => {
    expect(
      cardToIndex({
        suit: CLUBS,
        rank: 'ace',
        indexInSuit: 0,
      }),
    ).toBe(0);
    expect(
      cardToIndex({
        suit: DIAMONDS,
        rank: 2,
        indexInSuit: 0,
      }),
    ).toBe(14);
    expect(
      cardToIndex({
        suit: DIAMONDS,
        rank: 'king',
        indexInSuit: 12,
      }),
    ).toBe(25);
  });

  test('can move over', () => {
    // expect(canMoveOver(null, 0)).toBe(false);

    expect(canMoveOver(0, 0)).toBe(false);

    expect(canMoveOver(0, undefined)).toBe(true);

    let fromCard: CardType = {
      suit: DIAMONDS,
      rank: 9,
      indexInSuit: 0,
    };
    let toCard: CardType = {
      suit: SPADES,
      rank: 10,
      indexInSuit: 0,
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(true);

    fromCard = {
      suit: SPADES,
      rank: 9,
      indexInSuit: 0,
    };
    toCard = {
      suit: DIAMONDS,
      rank: 10,
      indexInSuit: 0,
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(true);

    fromCard = {
      suit: DIAMONDS,
      rank: 9,
      indexInSuit: 0,
    };
    toCard = {
      suit: HEARTS,
      rank: 10,
      indexInSuit: 0,
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(false);

    fromCard = {
      suit: DIAMONDS,
      rank: 8,
      indexInSuit: 0,
    };
    toCard = {
      suit: SPADES,
      rank: 10,
      indexInSuit: 0,
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(false);

    fromCard = {
      suit: SPADES,
      rank: 10,
      indexInSuit: 0,
    };
    toCard = {
      suit: DIAMONDS,
      rank: 'jack',
      indexInSuit: 0,
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(true);

    fromCard = {
      suit: SPADES,
      rank: 4,
      indexInSuit: 0,
    };
    toCard = {
      suit: CLUBS,
      rank: 4,
      indexInSuit: 0,
    };
    expect(canMoveOver(cardToIndex(fromCard), cardToIndex(toCard))).toBe(false);
  });

  test('get stack from cascade', () => {
    let cards: CardType[] = [
      {
        suit: SPADES,
        rank: 'queen',
        indexInSuit: 0,
      },
      {
        suit: SPADES,
        rank: 'king',
        indexInSuit: 0,
      },
      {
        suit: DIAMONDS,
        rank: 4,
        indexInSuit: 0,
      },
      {
        suit: SPADES,
        rank: 3,
        indexInSuit: 0,
      },
    ];
    let cascade: number[] = cards.map(cardToIndex);

    let stack = getStackFromCascade(cascade);

    let expectedStack = [
      {
        suit: DIAMONDS,
        rank: 4,
        indexInSuit: 0,
      },
      {
        suit: SPADES,
        rank: 3,
        indexInSuit: 0,
      },
    ].map(cardToIndex);
    expect(stack).toStrictEqual(expectedStack);

    cards = [
      {
        suit: SPADES,
        rank: 'queen',
        indexInSuit: 0,
      },
      {
        suit: SPADES,
        rank: 'king',
        indexInSuit: 0,
      },
      {
        suit: DIAMONDS,
        rank: 2,
        indexInSuit: 0,
      },
      {
        suit: SPADES,
        rank: 3,
        indexInSuit: 0,
      },
    ];
    cascade = cards.map(cardToIndex);

    stack = getStackFromCascade(cascade);

    expectedStack = [
      {
        suit: SPADES,
        rank: 3,
        indexInSuit: 0,
      },
    ].map(cardToIndex);
    expect(stack).toStrictEqual(expectedStack);

    cascade = [];
    stack = getStackFromCascade(cascade);
    expectedStack = [];
    expect(stack).toStrictEqual(expectedStack);
  });

  test('get target foundation index', () => {
    let foundations: Array<number | undefined> = Array.from({ length: 4 });
    let card = cardToIndex({
      suit: CLUBS,
      rank: 'ace',
      indexInSuit: 0, // indexInSuit can be anything for this test
    });
    let actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: 0,
      canMove: true,
      shouldMove: true,
    });

    foundations = [
      cardToIndex({
        suit: CLUBS,
        rank: 'ace',
        indexInSuit: 0,
      }),
      undefined,
      undefined,
      undefined,
    ];
    card = cardToIndex({
      suit: DIAMONDS,
      rank: 'ace',
      indexInSuit: 0,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: 1,
      canMove: true,
      shouldMove: true,
    });

    foundations = [
      cardToIndex({
        suit: CLUBS,
        rank: 'ace',
        indexInSuit: 0,
      }),
      cardToIndex({
        suit: DIAMONDS,
        rank: 'ace',
        indexInSuit: 0,
      }),
      undefined,
      undefined,
    ];
    card = cardToIndex({
      suit: HEARTS,
      rank: 'ace',
      indexInSuit: 0,
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
      suit: DIAMONDS,
      rank: 2,
      indexInSuit: 0,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: -1,
      canMove: false,
      shouldMove: false,
    });

    foundations = [
      cardToIndex({
        suit: CLUBS,
        rank: 'ace',
        indexInSuit: 0,
      }),
      undefined,
      undefined,
      undefined,
    ];
    card = cardToIndex({
      suit: DIAMONDS,
      rank: 2,
      indexInSuit: 0,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: -1,
      canMove: false,
      shouldMove: false,
    });

    foundations = [
      cardToIndex({
        suit: DIAMONDS,
        rank: 'ace',
        indexInSuit: 0,
      }),
      undefined,
      undefined,
      undefined,
    ];
    card = cardToIndex({
      suit: DIAMONDS,
      rank: 2,
      indexInSuit: 0,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: 0,
      canMove: true,
      shouldMove: true,
    });

    foundations = [
      cardToIndex({
        suit: CLUBS,
        rank: 'ace',
        indexInSuit: 0,
      }),
      cardToIndex({
        suit: DIAMONDS,
        rank: 'ace',
        indexInSuit: 0,
      }),
      cardToIndex({
        suit: SPADES,
        rank: 'ace',
        indexInSuit: 0,
      }),
      undefined,
    ];
    card = cardToIndex({
      suit: DIAMONDS,
      rank: 2,
      indexInSuit: 0,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: 1,
      canMove: true,
      shouldMove: true,
    });

    foundations = [
      cardToIndex({
        suit: DIAMONDS,
        rank: 'ace',
        indexInSuit: 0,
      }),
      undefined,
      undefined,
      undefined,
    ];
    card = cardToIndex({
      suit: DIAMONDS,
      rank: 3,
      indexInSuit: 0,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: -1,
      canMove: false,
      shouldMove: false,
    });

    foundations = [
      cardToIndex({
        suit: DIAMONDS,
        rank: 2,
        indexInSuit: 0,
      }),
      undefined,
      undefined,
      undefined,
    ];
    card = cardToIndex({
      suit: DIAMONDS,
      rank: 3,
      indexInSuit: 0,
    });
    actual = canMoveToFoundation(foundations, card);
    expect(actual).toStrictEqual({
      index: 0,
      canMove: true,
      shouldMove: false,
    });
  });
});
