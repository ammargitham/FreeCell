import { transform, isNil } from 'lodash';
import seedrandom from 'seedrandom';
import {
  Card, CardRank, JackQueenKing, MoveToFoundationCheckResult, suitNameColorMap, suitNames, suits,
} from '../globals/types';
import { GameState } from './types';

export const minGameNum = 1;
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER#polyfill
export const maxGameNum = Number.MAX_SAFE_INTEGER || 9007199254740991; // Math.pow(2, 53) - 1;

export const getGameNumFromRandom = (random: number) => minGameNum
  + Math.round(random * (maxGameNum - minGameNum + 1));

export const storeGameState = (state: GameState) => {
  localStorage.setItem('state', JSON.stringify(state));
};

function nullsToUndefined<T>(arr: Array<T | null>): Array<T | undefined> {
  return arr.map((c) => (c === null ? undefined : c));
}

const getStoredGameState = (): GameState | null => {
  const stateString = localStorage.getItem('state');
  if (!stateString) {
    return null;
  }
  try {
    const state: GameState = JSON.parse(stateString);
    // convert nulls to undefined
    state.history = state.history.map((h) => {
      const newH = h;
      newH.openCards = nullsToUndefined(newH.openCards);
      newH.foundationCards = nullsToUndefined(newH.foundationCards);
      return newH;
    });
    state.openCards = nullsToUndefined(state.openCards);
    state.foundationCards = nullsToUndefined(state.foundationCards);
    return state;
  } catch (err) {
    return null;
  }
};

// https://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed
const shuffle = (array: any[], rndGen: seedrandom.PRNG) => {
  // TODO Create copy before shuffling
  let m = array.length;
  let t;
  let i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    // eslint-disable-next-line no-plusplus
    i = Math.floor(rndGen() * m--);

    // And swap it with the current element.
    t = array[m];
    // eslint-disable-next-line no-param-reassign
    array[m] = array[i];
    // eslint-disable-next-line no-param-reassign
    array[i] = t;
  }

  return array;
};

export const getRandomCascades = (gameNum: number) => {
  const rndGen = seedrandom(gameNum.toString());
  const cards = Array.from({ length: 52 }, (_v, i) => i);
  // console.log(seed, cards);
  const shuffled = shuffle([...cards], rndGen);
  // console.log(shuffled);

  // https://stackoverflow.com/a/60231868/1436766
  const sizes = [7, 7, 7, 7, 6, 6, 6, 6];
  let i = 0;
  let j = 0;
  const chunks = [];
  while (i < shuffled.length) {
    // eslint-disable-next-line no-plusplus
    chunks.push(shuffled.slice(i, (i += sizes[j++ % sizes.length])));
  }
  // console.log(chunks);
  return chunks;
};

/**
 * Generates new game or loads a game from local storage
 *
 * @param {Object} initialState - The initial state which will be used as base for the new game
 * state
 * @param {int} gameNum - If provided, the initialized game state will be for that game number.
 * If not provided, a new game will be generated. Note that if `loadFromStorage` is true and a
 * game from storage is loaded, this parameter will be ignored
 * @param {boolean} loadFromStorage - If set to true, a game will be loaded from local storage.
 * `initialState` and `gameNum` will be ignored if a game state is found in storage.
 */
export const generateNewGameState = (
  initialState: any,
  gameNum?: number,
  loadFromStorage?: boolean,
): { loaded: boolean, state: GameState } => {
  if (loadFromStorage) {
    const loadedState = getStoredGameState();
    // console.log(loadedState);
    if (loadedState) {
      return {
        loaded: true,
        state: loadedState,
      };
    }
  }

  let gameNumTemp = gameNum || -1;
  if (!gameNum) {
    // create seed and random generator
    const gameNumGenerator = seedrandom();
    const random = gameNumGenerator();
    gameNumTemp = getGameNumFromRandom(random);
  }

  const cascades = getRandomCascades(gameNumTemp);
  return {
    loaded: false,
    state: {
      ...initialState,
      gameNum: gameNumTemp,
      cascades,
      history: [
        {
          openCards: initialState.openCards,
          foundationCards: initialState.foundationCards,
          cascades,
        },
      ],
    },
  };
};

const endRanks: JackQueenKing[] = ['jack', 'queen', 'king'];

export const indexToCard: (index: number) => Card | undefined = (index) => {
  if (index < 0 || index > 52) {
    return undefined;
  }
  const row = Math.floor(index / 13);
  const col = index % 13;

  let rank: CardRank;
  if (col === 0) {
    rank = 'ace';
  } else if (col > 9) {
    rank = endRanks[col - 10];
  } else {
    rank = col + 1;
  }
  return {
    suit: suits[row],
    rank,
    indexInSuit: col,
  };
};

export const cardToIndex = (card: Card) => {
  const { suit, rank } = card;
  const suitIndex = suitNames.indexOf(suit.name);
  let rankIndex = -1;
  if (rank === 'ace') {
    rankIndex = 0;
  } else if (typeof rank === 'string' && endRanks.includes(rank)) {
    const endRankIndex = endRanks.indexOf(rank);
    rankIndex = endRankIndex + 10;
  } else if (typeof rank === 'number') {
    rankIndex = rank - 1;
  }
  if (rankIndex < 0) {
    return -1;
  }
  return 13 * suitIndex + rankIndex;
};

export const canMoveOver = (fromIndex: number, toIndex?: number) => {
  if (toIndex === undefined) {
    // we can move to an empty cascade
    return true;
  }
  if (fromIndex === toIndex) {
    return false;
  }
  const fromCard = indexToCard(fromIndex);
  const toCard = indexToCard(toIndex);
  if (!fromCard || !toCard) {
    return false;
  }

  // if both cards' suits' color are same, they cannot move
  if (suitNameColorMap[fromCard.suit.name] === suitNameColorMap[toCard.suit.name]) {
    return false;
  }
  // to card's index should be 1 above from card's index
  if (fromCard.indexInSuit !== toCard.indexInSuit - 1) {
    return false;
  }
  return true;
};

/**
 * Find the longest stack possible (from the end) in this cascade
 *
 * @param {number[]} cascade  Cascade from which stack will be extracted
 * @returns {number[]} stack of cards
 */
export const getStackFromCascade = (cascade: number[]) => {
  if (!cascade) {
    return [];
  }

  // create cascade copy and reverse it
  const cascadeCopy = [...cascade];
  cascadeCopy.reverse();

  const stack = transform(
    cascadeCopy,
    (acc: number[], curr) => {
      if (!acc.length) {
        acc.push(curr);
        return true;
      }
      // check if prev card can move over curr
      const prev = acc[acc.length - 1];
      const canMove = canMoveOver(prev, curr);
      if (canMove) {
        // if can move, append curr to acc
        acc.push(curr);
        return true;
      }
      return false;
    },
    [],
  ).reverse();

  return stack;
};

/**
 * Check if given card can be moved to any of the foundation cell
 *
 * @param {Array<number | undefined>} foundations Foundation array
 * @param {number} cardIndex Card index to check
 * @returns {MoveToFoundationCheckResult} Result
 */
export function canMoveToFoundation(
  foundations: Array<number | undefined>,
  cardIndex: number,
): MoveToFoundationCheckResult {
  if (isNil(cardIndex)) {
    return {
      index: -1,
      canMove: false,
      shouldMove: false,
    };
  }
  // console.log(foundations, cardIndex);
  const card = indexToCard(cardIndex);
  if (!card) {
    return {
      index: -1,
      canMove: false,
      shouldMove: false,
    };
  }
  if (card.indexInSuit === 0) {
    // got ace, can be moved to the first empty foundation we find
    return {
      index: foundations.findIndex((f) => isNil(f)),
      canMove: true,
      shouldMove: true,
    };
  }
  const foundationCards = foundations.map((f) => {
    if (isNil(f)) {
      return undefined;
    }
    return indexToCard(f);
  });

  // console.log(foundationCards, card);

  // check if one rank lower card exists in any of the foundation cells
  const index = foundationCards.findIndex((c) => c
    && c.suit === card.suit
    && c.indexInSuit === card.indexInSuit - 1);

  if (index < 0) {
    // not found, cannot be moved
    return {
      index,
      canMove: false,
      shouldMove: false,
    };
  }

  // can be moved. Now need to check if it should be moved

  // now if this card is rank 2, it should be moved, since ace of same suit is already moved
  if (card.rank === 2) {
    return {
      index,
      canMove: true,
      shouldMove: true,
    };
  }

  // this card `should` be moved only if there are no cards remaining on the board which can be
  // moved over this card.
  // for eg. if card is `3 of diamonds`, and `2 of clubs` is still in the tableau or open cell,
  // there is a possibility that the user can move `2 of clubs` over `3 of diamonds`.
  // Hence the card can still be used, so `shouldMove` has to be set to `false`.
  // Otherwise if both "black" 2s are already moved to foundation, this card can and should be moved

  // check if cards movable on the current card have been moved to foundation already

  const cardColor = suitNameColorMap[card.suit.name];
  const checkColor = cardColor === 'red' ? 'black' : 'red';
  const checkSuits = Object.entries(suitNameColorMap)
    .filter(([, color]) => color === checkColor)
    .map(([s]) => s);
  const checkIndexInSuit = card.indexInSuit - 1;

  // console.log(checkColor, checkSuits, checkIndexInSuit);

  const allMoved = foundationCards.filter((f) => (f
    && checkSuits.includes(f.suit.name)
    && f.indexInSuit >= checkIndexInSuit)).length === 2;

  // console.log(allMoved);

  return {
    index,
    canMove: true,
    shouldMove: allMoved,
  };
}

function emptyCellsCount(openCards: Array<number | undefined>) {
  return openCards.filter((c) => c === undefined).length;
}

function emptyCascadesCount(cascades: number[][]) {
  return cascades.filter((c) => !c.length).length;
}

export function movableCardCount(
  openCards: Array<number | undefined>,
  cascades: number[][],
  toCascadeIndex: number,
) {
  let emptyCascadesCountVal = emptyCascadesCount(cascades);
  if (toCascadeIndex >= 0 && emptyCascadesCountVal > 0) {
    // check if the toCascade is one of the empty cascades
    const isToEmpty = cascades[toCascadeIndex].length === 0;
    // console.log(isToEmpty);

    // if empty, lower the empty cascade count by 1
    if (isToEmpty) {
      emptyCascadesCountVal -= 1;
    }
  }
  return 2 ** emptyCascadesCountVal * (emptyCellsCount(openCards) + 1);
}

export function findCascadeIndex(cascades: number[][], cardIndex: number) {
  return cascades.findIndex((c) => c.includes(cardIndex));
}

export function checkIfWon(foundationCards: Array<number | undefined>) {
  return !!(
    foundationCards
    && foundationCards.every((c) => c !== undefined)
    && foundationCards
      .map((c) => indexToCard(c!))
      .every((c) => c?.rank === 'king')
  );
}
