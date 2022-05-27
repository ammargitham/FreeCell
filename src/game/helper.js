import { transform, isNil } from "lodash";
import seedrandom from "seedrandom";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER#polyfill
if (!Number.MAX_SAFE_INTEGER) {
  Number.MAX_SAFE_INTEGER = 9007199254740991; // Math.pow(2, 53) - 1;
}

export const minGameNum = 1;
export const maxGameNum = Number.MAX_SAFE_INTEGER;

export const getGameNumFromRandom = (random) => {
  return minGameNum + Math.round(random * (maxGameNum - minGameNum + 1));
};

export const storeGameState = (state) => {
  localStorage.setItem("state", JSON.stringify(state));
};

const getStoredGameState = () => {
  try {
    return JSON.parse(localStorage.getItem("state"));
  } catch (err) {
    return null;
  }
};

/**
 * Generates new game or loads a game from local storage
 * @param {Object} initialState - The initial state which will be used as base for the new game state
 * @param {int} gameNum - If provided, the initialized game state will be for that game number. If not provided, a new game will be generated. Note that if `loadFromStorage` is true and a game from storage is loaded, this parameter will be ignored
 * @param {boolean} loadFromStorage - If set to true, a game will be loaded from local storage. `initialState` and `gameNum` will be ignored if a game state is found in storage.
 */
export const generateNewGameState = (
  initialState,
  gameNum,
  loadFromStorage,
) => {
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

  let gameNumTemp = gameNum;
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

// https://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed
const shuffle = (array, rndGen) => {
  let m = array.length;
  let t;
  let i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(rndGen() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

export const getRandomCascades = (gameNum) => {
  const rndGen = seedrandom(gameNum);
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
    chunks.push(shuffled.slice(i, (i += sizes[j++ % sizes.length])));
  }
  // console.log(chunks);
  return chunks;
};

export const suits = {
  CLUBS: {
    name: "clubs",
    color: "black",
  },
  DIAMONDS: {
    name: "diamonds",
    color: "red",
  },
  HEARTS: {
    name: "hearts",
    color: "red",
  },
  SPADES: {
    name: "spades",
    color: "black",
  },
};
const suitNames = Object.values(suits).map((v) => v.name);
const suitColorMap = Object.values(suits).reduce((prev, v) => {
  prev[v.name] = v.color;
  return prev;
}, {});

const endRanks = ["jack", "queen", "king"];

export const indexToCard = (index) => {
  if (isNil(index)) {
    return null;
  }
  const row = Math.floor(index / 13);
  const col = index % 13;

  let rank;
  if (col === 0) {
    rank = "ace";
  } else if (col > 9) {
    rank = endRanks[col - 10];
  } else {
    rank = col + 1;
  }
  return {
    suit: suitNames[row],
    rank,
    indexInSuit: col, // can be used to check hierarchy
  };
};

export const cardToIndex = (card) => {
  if (!card) {
    return null;
  }
  const { suit, rank } = card;
  const suitIndex = suitNames.indexOf(suit);
  let rankIndex = -1;
  if (rank === "ace") {
    rankIndex = 0;
  } else if (endRanks.includes(rank)) {
    const endRankIndex = endRanks.indexOf(rank);
    rankIndex = endRankIndex + 10;
  } else {
    rankIndex = rank - 1;
  }
  return 13 * suitIndex + rankIndex;
};

export const canMoveOver = (fromIndex, toIndex) => {
  if (toIndex == null) {
    // we can move to an empty cascade
    return true;
  }
  if (fromIndex === toIndex || isNil(fromIndex)) {
    return false;
  }
  const fromCard = indexToCard(fromIndex);
  const toCard = indexToCard(toIndex);
  if (!fromCard || !toCard) {
    return false;
  }

  // if both cards' suits' color are same, they cannot move
  if (suitColorMap[fromCard.suit] === suitColorMap[toCard.suit]) {
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
 * @param {int[]} cascade  Cascade from which stack will be extracted
 * @returns {int[]} stack of cards
 */
export const getStackFromCascade = (cascade) => {
  if (!cascade) {
    return [];
  }

  // create cascade copy and reverse it
  const cascadeCopy = [...cascade];
  cascadeCopy.reverse();

  const stack = transform(
    cascadeCopy,
    function iterator(acc, curr) {
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
 * Result of foundation check
 *
 * @typedef {Object} MoveToFoundationCheckResult
 * @property {int} index - Index of the foundation. Can be -1 if none found
 * @property {boolean} canMove - Indicates if the card can move to `index`.
 * @property {boolean} shouldMove - Indicates if the card should move to `index`.
 */

/**
 * Check if given card can be moved to any of the foundation cell
 *
 * @param {int[]} foundations Foundation array
 * @param {int} cardIndex Card index to check
 * @returns {MoveToFoundationCheckResult} Result
 */
export const canMoveToFoundation = (foundations, cardIndex) => {
  if (isNil(cardIndex)) {
    return {
      index: -1,
      canMove: false,
      shouldMove: false,
    };
  }
  // console.log(foundations, cardIndex);
  const card = indexToCard(cardIndex);
  if (card.indexInSuit === 0) {
    // got ace, can be moved to the first empty foundation we find
    return {
      index: foundations.findIndex((f) => isNil(f)),
      canMove: true,
      shouldMove: true,
    };
  }
  const foundationCards = foundations.map(indexToCard);

  // console.log(foundationCards, card);

  // check if one rank lower card exists in any of the foundation cells
  const index = foundationCards.findIndex((c) => {
    return c && c.suit === card.suit && c.indexInSuit === card.indexInSuit - 1;
  });

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

  // this card `should` be moved only if there are no cards remaining on the board which can be moved over this card
  // for eg. if card is `3 of diamonds`, and `2 of clubs` is still in the tableau or open cell, there is a possibility
  // that the user can move `2 of clubs` over `3 of diamonds`. Hence the card can still be used, so `shouldMove`
  // has to be set to `false`. Otherwise if both "black" 2s are already moved to foundation, this card can and
  // should be moved.

  // check if cards movable on the current card have been moved to foundation already

  const cardColor = suitColorMap[card.suit];
  const checkColor = cardColor === "red" ? "black" : "red";
  const checkSuits = Object.entries(suitColorMap)
    .filter(([_s, color]) => {
      return color === checkColor;
    })
    .map(([s, _color]) => {
      return s;
    });
  const checkIndexInSuit = card.indexInSuit - 1;

  // console.log(checkColor, checkSuits, checkIndexInSuit);

  const allMoved =
    foundationCards.filter((f) => {
      return (
        f && checkSuits.includes(f.suit) && f.indexInSuit >= checkIndexInSuit
      );
    }).length === 2;

  // console.log(allMoved);

  return {
    index,
    canMove: true,
    shouldMove: allMoved,
  };
};

function emptyCellsCount(openCards) {
  return openCards.filter((c) => isNil(c)).length;
}

function emptyCascadesCount(cascades) {
  return cascades.filter((c) => !c.length).length;
}

export function movableCardCount(openCards, cascades, toCascadeIndex) {
  let emptyCascadesCountVal = emptyCascadesCount(cascades);
  if (toCascadeIndex >= 0 && emptyCascadesCount > 0) {
    // check if the toCascade is one of the empty cascades
    const isToEmpty = cascades[toCascadeIndex].length === 0;
    // console.log(isToEmpty);

    // if empty, lower the empty cascade count by 1
    if (isToEmpty) {
      emptyCascadesCountVal -= 1;
    }
  }
  return Math.pow(2, emptyCascadesCountVal) * (emptyCellsCount(openCards) + 1);
}

export function findCascadeIndex(cascades, cardIndex) {
  return cascades.findIndex((c) => {
    return c.includes(cardIndex);
  });
}

export function checkIfWon(foundationCards) {
  return !!(
    foundationCards &&
    foundationCards
      .map((c) => indexToCard(c))
      .every((c) => c && c.rank === "king")
  );
}
