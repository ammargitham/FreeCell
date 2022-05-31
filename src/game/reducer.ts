import { cloneDeep, isNil } from 'lodash';
import { GameState, Action } from './types';

import {
  canMoveOver,
  getStackFromCascade,
  canMoveToFoundation,
  findCascadeIndex,
  movableCardCount,
} from './helper';

export const initialState: GameState = {
  loading: true,
  openCards: Array.from({ length: 4 }),
  foundationCards: Array.from({ length: 4 }),
  cascades: [],
  history: [],
  moveCount: 0,
  wasLastUndo: false,
  elapsedTime: 0,
  paused: true,
};

export default function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'reset': {
      if (!state.history || state.history.length <= 0) {
        return state;
      }
      // reset to first element in history
      const first = cloneDeep(state.history[0]);
      const updatedHistory = [first];
      const { cascades, openCards, foundationCards } = first;
      return {
        ...state,
        moveCount: updatedHistory.length - 1,
        cascades,
        openCards,
        foundationCards,
        history: updatedHistory,
      };
    }
    case 'set_state': {
      return action.state;
    }
    case 'undo': {
      if (!state.history || state.history.length <= 1) {
        return state;
      }
      const updatedHistory = cloneDeep(state.history);
      updatedHistory.pop();
      const { cascades, openCards, foundationCards } = updatedHistory[
        updatedHistory.length - 1
      ];
      return {
        ...state,
        moveCount: updatedHistory.length - 1,
        cascades,
        openCards,
        foundationCards,
        history: updatedHistory,
        wasLastUndo: true,
      };
    }
    case 'open_cell_click': {
      const openCellCard = state.openCards[action.cellIndex];
      const updatedOpenCards = [...state.openCards] || Array.from({ length: 4 });
      // if there is an active card
      if (!isNil(state.activeCard)) {
        // if current clicked cell contains a card, do nothing and deactivate active card
        if (openCellCard) {
          return {
            ...state,
            activeCard: undefined,
          };
        }
        // else move the active card to the open cell
        updatedOpenCards[action.cellIndex] = state.activeCard;
        // find the index of the cascade which contains the active card
        const cascadeIndex = findCascadeIndex(state.cascades, state.activeCard);
        // get cascade using index
        const cascade = state.cascades[cascadeIndex];

        // maybe clicked open cell again
        if (!cascade) {
          return state;
        }

        // remove the active card from the cascade
        const updatedCascade = cascade.filter(
          (card) => card !== state.activeCard,
        );
        // create cascades copy
        const updatedCascades = cloneDeep(state.cascades);
        // set the updated cascade in the cascades copy using index
        updatedCascades[cascadeIndex] = updatedCascade;

        const updatedHistory = cloneDeep(state.history);
        updatedHistory.push({
          cascades: updatedCascades,
          openCards: updatedOpenCards,
          foundationCards: state.foundationCards,
        });

        return {
          ...state,
          openCards: updatedOpenCards,
          cascades: updatedCascades,
          activeCard: undefined,
          moveCount: state.moveCount + 1,
          history: updatedHistory,
          wasLastUndo: false,
        };
      }
      // no active card, if current clicked open cell has a card, make it active
      return {
        ...state,
        activeCard: openCellCard,
      };
    }
    case 'cascade_click': {
      // console.log("on cascade click", action.cascadeIndex);

      if (state.activeCard) {
        // check if active card is in open cell
        const openCellIndex = state.openCards.findIndex(
          (c) => c === state.activeCard,
        );

        // from stack is the stack of cards to move from one place to another
        let fromStack: number[];
        let fromCascadeIndex = -1;
        const toCascadeIndex = action.cascadeIndex;

        if (openCellIndex >= 0) {
          // fromStack would just include the active card
          fromStack = [state.activeCard];
        } else {
          const activeCardCascadeIndex = findCascadeIndex(
            state.cascades,
            state.activeCard,
          );

          if (activeCardCascadeIndex < 0) {
            // no cascade found, should not be possible to reach here
            return state;
          }

          if (activeCardCascadeIndex === action.cascadeIndex) {
            // same cascade clicked, deactivate the active card
            return {
              ...state,
              activeCard: undefined,
            };
          }

          fromCascadeIndex = activeCardCascadeIndex;
          const fromCascade = state.cascades[fromCascadeIndex];
          fromStack = getStackFromCascade(fromCascade);
          const movableCount = movableCardCount(
            state.openCards,
            state.cascades,
            toCascadeIndex,
          );
          // get last x cards from the stack, where x is the no. of movable cards
          fromStack = fromStack.slice(
            Math.max(fromStack.length - movableCount, 0),
          );
        }

        let i;
        let canMove;

        const toCascade = state.cascades[toCascadeIndex];
        const toCard = toCascade.length === 0 ? undefined : toCascade[toCascade.length - 1];

        for (i = 0; i < fromStack.length; i += 1) {
          // we need to check if card in the fromStack is movable to the next card
          // we have to perform a loop until we exhause possible fromCards in the fromStack
          const fromCard = fromStack[i];
          // check if from card can be moved to the next card
          canMove = canMoveOver(fromCard, toCard);
          if (canMove) {
            break;
          }
        }

        // if none of the cards in the stack are movable, deactivate active card and return
        if (!canMove) {
          return {
            ...state,
            activeCard: undefined,
          };
        }

        let updatedOpenCards = state.openCards;
        let updatedFromCascade;

        // if from card was from open cell, remove it
        if (openCellIndex >= 0) {
          updatedOpenCards = [...state.openCards];
          updatedOpenCards[openCellIndex] = undefined;
        } else {
          const fromCascade = state.cascades[fromCascadeIndex];
          fromStack = fromStack.splice(i);
          // remove the `from` cards from the fromCascade
          updatedFromCascade = fromCascade.filter(
            (card) => !fromStack.includes(card),
          );
        }

        // push the from cards to the toCascade copy
        const updatedToCascade = [...toCascade];
        updatedToCascade.push(...fromStack);

        // create cascades copy
        const updatedCascades = cloneDeep(state.cascades);

        // update the from and to cascades in the cascades copy using index
        if (fromCascadeIndex >= 0 && updatedFromCascade !== undefined) {
          updatedCascades[fromCascadeIndex] = updatedFromCascade;
        }
        updatedCascades[toCascadeIndex] = updatedToCascade;

        const updatedHistory = cloneDeep(state.history);
        updatedHistory.push({
          cascades: updatedCascades,
          openCards: updatedOpenCards,
          foundationCards: state.foundationCards,
        });

        return {
          ...state,
          cascades: updatedCascades,
          openCards: updatedOpenCards,
          activeCard: undefined,
          moveCount: state.moveCount + 1,
          history: updatedHistory,
          wasLastUndo: false,
        };
      }

      const cascade = state.cascades[action.cascadeIndex];
      if (!cascade || cascade.length === 0) {
        return state;
      }

      // make the last card in this cascade active
      const lastCard = cascade[cascade.length - 1];
      return {
        ...state,
        activeCard: lastCard,
      };
    }
    case 'move': {
      if (state.wasLastUndo) {
        return state;
      }
      // on any move, check for cards which 'should' move to foundation
      let bottomCards = state.cascades.map((c) => {
        if (!c || !c.length) {
          return undefined;
        }
        return c[c.length - 1];
      });

      let moveResults = bottomCards.map((b) => {
        if (b === undefined) {
          return {
            index: -1,
            canMove: false,
            shouldMove: false,
          };
        }
        return canMoveToFoundation(state.foundationCards, b);
      });

      let firstMovableIndex = moveResults.findIndex((m) => m.shouldMove);

      // console.log(firstMovableIndex);

      let updatedOpenCards = state.openCards;
      let updatedCascades = state.cascades;

      if (firstMovableIndex < 0) {
        // check if any open cell card should be moved
        bottomCards = state.openCards;
        moveResults = bottomCards.map((c) => {
          if (c === undefined) {
            return {
              index: -1,
              canMove: false,
              shouldMove: false,
            };
          }
          return canMoveToFoundation(state.foundationCards, c);
        });

        firstMovableIndex = moveResults.findIndex((m) => m.shouldMove);

        // console.log(firstMovableIndex);

        if (firstMovableIndex < 0) {
          return state;
        }

        // move from open cell to foundation

        // remove the from card from the open cell
        updatedOpenCards = [...state.openCards];
        updatedOpenCards[firstMovableIndex] = undefined;
      } else {
        // move from cascade to foundation

        // get from cascade using index
        const fromCascade = state.cascades[firstMovableIndex];

        // remove the from card from the fromCascade
        const updatedFromCascade = fromCascade.filter(
          (card) => card !== bottomCards[firstMovableIndex],
        );
        updatedCascades = cloneDeep(state.cascades);
        updatedCascades[firstMovableIndex] = updatedFromCascade;
      }

      // push the card to the foundation index
      const updatedFoundationCards = [...state.foundationCards];
      const foundationIndex = moveResults[firstMovableIndex].index;
      updatedFoundationCards[foundationIndex] = bottomCards[firstMovableIndex];

      const updatedHistory = cloneDeep(state.history);
      updatedHistory.push({
        cascades: updatedCascades,
        openCards: updatedOpenCards,
        foundationCards: updatedFoundationCards,
      });

      return {
        ...state,
        cascades: updatedCascades,
        openCards: updatedOpenCards,
        foundationCards: updatedFoundationCards,
        moveCount: state.moveCount + 1,
        history: updatedHistory,
        wasLastUndo: false,
      };
    }
    case 'update_elapsed_time': {
      return {
        ...state,
        elapsedTime: action.elapsedTime,
      };
    }
    case 'pause': {
      return {
        ...state,
        paused: action.paused,
      };
    }
    case 'new_game':
      return state;
    default: {
      // Note if there is an error below, it means all cases have not been handled above
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}
