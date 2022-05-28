import { useReducer, useCallback, useEffect, useMemo, useState } from "react";
import { cloneDeep, isNil } from "lodash";

import {
  canMoveOver,
  getStackFromCascade,
  canMoveToFoundation,
  generateNewGameState,
  findCascadeIndex,
  movableCardCount,
  storeGameState,
  checkIfWon,
} from "./helper";
import { dbManager } from "../db";
import GameResult from "../db/GameResult";

export const initialState = {
  loading: true,
  gameNum: null,
  openCards: Array.from({ length: 4 }),
  foundationCards: Array.from({ length: 4 }),
  cascades: [],
  activeCard: null,
  history: [],
  moveCount: 0,
  wasLastUndo: false,
  elapsedTime: 0,
  paused: true,
};

const actions = {
  reset: "reset",
  newGame: "newGame",
  setState: "setState",
  undo: "undo",
  openCellClick: "openCellClick",
  onMove: "onMove",
  onCascadeClick: "onCascadeClick",
  updateElapsedTime: "updateElapsedTime",
  setPaused: "setPaused",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.reset: {
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
    case actions.setState: {
      return action.state;
    }
    case actions.undo: {
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
    case actions.openCellClick: {
      const openCellCard = state.openCards[action.cellIndex];
      let updatedOpenCards = [...state.openCards] || Array.from({ length: 4 });
      // if there is an active card
      if (!isNil(state.activeCard)) {
        // if current clicked cell contains a card, do nothing and deactivate active card
        if (openCellCard) {
          return {
            ...state,
            activeCard: null,
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
          activeCard: null,
          moveCount: state.moveCount + 1,
          history: updatedHistory,
          wasLastUndo: false,
        };
      }
      // no active card, if current clicked open cell has a card, make it active
      return {
        ...state,
        activeCard: openCellCard || null,
      };
    }
    case actions.onCascadeClick: {
      // console.log("on cascade click", action.cascadeIndex);

      if (state.activeCard) {
        // check if active card is in open cell
        const openCellIndex = state.openCards.findIndex(
          (c) => c === state.activeCard,
        );

        // from stack is the stack of cards to move from one place to another
        let fromStack;
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
              activeCard: null,
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
        const toCard =
          toCascade.length === 0 ? null : toCascade[toCascade.length - 1];

        for (i = 0; i < fromStack.length; i++) {
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
            activeCard: null,
          };
        }

        let updatedOpenCards = state.openCards;
        let updatedFromCascade;

        // if from card was from open cell, remove it
        if (openCellIndex >= 0) {
          updatedOpenCards = [...state.openCards];
          updatedOpenCards[openCellIndex] = null;
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
        if (fromCascadeIndex >= 0) {
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
          activeCard: null,
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

      // // first check if active card in open cell or another cascade
      // const openCellIndex = state.openCards.findIndex(c => c === state.activeCard)
      // const fromCascadeIndex = findCascadeIndex(state.cascades, state.activeCard)

      // if (openCellIndex >= 0) {
      //   // move from open cell to this cascade

      // } else if (fromCascadeIndex >= 0) {
      //   // move from fromCascade to this cascade

      // } else {
      //   // not possible to reach here if everything normal
      //   return state;
      // }
    }
    case actions.onMove: {
      if (state.wasLastUndo) {
        return state;
      }
      // on any move, check for cards which 'should' move to foundation
      let bottomCards = state.cascades.map((c) => {
        if (!c || !c.length) {
          return null;
        }
        return c[c.length - 1];
      });

      // console.log(bottomCards);

      let moveResults = bottomCards.map((b) => {
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
        updatedOpenCards[firstMovableIndex] = null;
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
    case actions.updateElapsedTime: {
      return {
        ...state,
        elapsedTime: action.elapsedTime,
      };
    }
    case actions.setPaused: {
      return {
        ...state,
        paused: action.paused,
      };
    }
    default:
      return state;
  }
};

const useFreeCellGame = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [canStartTimer, setCanStartTimer] = useState(false);

  // keeping a separate paused state, so that its is not written to local storage
  // const [timerState, setTimerState] = useState({
  //   startAt: 0,
  //   paused: true,
  // });

  // const { elapsedTime, reset: resetTimer } = useElapsedTime({
  //   isPlaying: !state.paused,
  //   startAt: 0,
  //   updateInterval: 1,
  // });

  // const { time, start, pause, reset: resetTimer, status } = useTimer({
  //   initialTime: state.elapsedTime,
  // });

  // useEffect(() => {
  //   if (state.loading || state.paused || !canStartTimer) {
  //     return;
  //   }
  //   console.log(time);
  //   // dispatch({
  //   //   type: actions.updateElapsedTime,
  //   //   elapsedTime: time,
  //   // });
  // }, [canStartTimer, state.loading, state.paused, time]);

  // useEffect(() => {
  //   if (state.loading || state.paused || !canStartTimer) {
  //     pause();
  //     return;
  //   }
  //   start();
  // }, [state.paused, state.loading, canStartTimer, start, pause]);

  useEffect(() => {
    // generate or load game
    const { state: gotState, loaded } = generateNewGameState(
      initialState,
      null,
      true,
    );
    // set its loading to false
    gotState.loading = false;
    gotState.paused = false;

    if (loaded) {
      // check if won or lost, if not resume the timer
      const hasWon = checkIfWon(gotState.foundationCards);
      if (hasWon) {
        gotState.paused = true;
      }
    }

    // dispatch it to reducer
    dispatch({
      type: actions.setState,
      state: gotState,
    });

    if (!loaded) {
      // if a new game was generated, save it to db
      dbManager
        .addOrUpdateGameResultByGameNum(
          new GameResult(
            null,
            gotState.gameNum,
            0,
            0,
            GameResult.Status.NOT_COMPLETED,
          ),
        )
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const canUndo = useMemo(() => state.history && state.history.length > 1, [
    state.history,
  ]);

  /* game has been won when all cards in foundation are kings*/
  const hasWon = useMemo(() => checkIfWon(state.foundationCards), [
    state.foundationCards,
  ]);

  useEffect(() => {
    if (state.loading) {
      return;
    }
    // save state on any change
    storeGameState(state);
  }, [state]);

  useEffect(() => {
    if (isNil(state.history)) {
      return;
    }
    dispatch({
      type: actions.onMove,
    });
  }, [state.history]);

  const reset = useCallback(() => {
    dispatch({
      type: actions.reset,
    });
  }, []);

  const newGame = useCallback(() => {
    const { state: gotState } = generateNewGameState(initialState, null, false);
    // set its loading to false
    gotState.loading = false;
    // dispatch it to reducer
    dispatch({
      type: actions.setState,
      state: gotState,
    });

    dbManager
      .addOrUpdateGameResultByGameNum(
        new GameResult(
          null,
          gotState.gameNum,
          0,
          0,
          GameResult.Status.NOT_COMPLETED,
        ),
      )
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (!hasWon) {
      return;
    }
    dispatch({
      type: actions.setPaused,
      paused: true,
    });
    //   const updateResult = async () => {
    //     const existing = await dbManager.getGameResultByGameNum(state.gameNum);
    //     console.log(existing);
    //     let gameResult = existing;
    //     if (!existing) {
    //       gameResult = new GameResult(
    //         null,
    //         state.gameNum,
    //         state.
    //       )
    //     }
    //   };
    //   updateResult().catch((err) => console.log(err));
  }, [hasWon]);

  const undo = useCallback(() => {
    dispatch({
      type: actions.undo,
    });
  }, []);

  const onOpenCellClick = useCallback((cellIndex) => {
    dispatch({
      type: actions.openCellClick,
      cellIndex,
    });
  }, []);

  const onCascadeClick = useCallback((cascadeIndex) => {
    dispatch({
      type: actions.onCascadeClick,
      cascadeIndex,
    });
  }, []);

  return [
    state,
    canUndo,
    hasWon,
    reset,
    newGame,
    undo,
    onOpenCellClick,
    onCascadeClick,
    setCanStartTimer,
  ];
};

export default useFreeCellGame;
