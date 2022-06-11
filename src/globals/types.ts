export type Suit = {
  name: string,
  color: 'black' | 'red',
};

export const CLUBS: Suit = {
  name: 'clubs',
  color: 'black',
};

export const DIAMONDS: Suit = {
  name: 'diamonds',
  color: 'red',
};

export const HEARTS: Suit = {
  name: 'hearts',
  color: 'red',
};

export const SPADES: Suit = {
  name: 'spades',
  color: 'black',
};

export const suits: Suit[] = [CLUBS, DIAMONDS, HEARTS, SPADES];
export const suitNames = Object.values(suits).map((v) => v.name);
export const suitNameColorMap: { [key: string]: 'black' | 'red' } = Object
  .values(suits)
  .reduce((prev: { [key: string]: 'black' | 'red' }, v) => {
    // eslint-disable-next-line no-param-reassign
    prev[v.name] = v.color;
    return prev;
  }, {});

export type JackQueenKing = 'jack' | 'queen' | 'king';
export type CardRank = number | 'ace' | JackQueenKing;

export type Card = {
  suit: Suit,
  rank: CardRank,
  indexInSuit: number, // can be used to check hierarchy
};

/**
 * Result of foundation check
 */
export type MoveToFoundationCheckResult = {
  /**
   * Index of the foundation. Can be -1 if none found
   */
  index: number,
  /**
   * Indicates if the card can move to `index`
   */
  canMove: boolean,
  /**
   * Indicates if the card should move to `index`
   */
  shouldMove: boolean,
};

export const DragType = {
  CARD: 'card',
};
