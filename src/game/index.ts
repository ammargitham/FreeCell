import {
  useReducer, useCallback, useEffect, useMemo, useState, Reducer,
} from 'react';

import { generateNewGameState, checkIfWon, storeGameState } from './helper';
import GameResult from '../db/GameResult';
import { GameResultStatus } from '../db/FreeCellDatabase';
import reducer, { initialState } from './reducer';
import { Action, GameState } from './types';
import useTimer from '../utils/useTimer';

export default function useFreeCellGame() : [
  state: GameState,
  canUndo: boolean,
  hasWon: boolean,
  togglePause: () => void,
  reset: () => void,
  newGame: () => void,
  undo: () => void,
  onOpenCellClick: (cellIndex: number) => void,
  onCascadeClick: (cellIndex: number) => void,
  setCanStartTimerWrapper: (canStart: boolean) => void,
] {
  const [state, dispatch] = useReducer<Reducer<GameState, Action>>(reducer, initialState);
  const [canStartTimer, setCanStartTimer] = useState(false);
  const {
    time: elapsedTime,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
    // status: timerStatue,
  } = useTimer();

  useEffect(() => {
    // generate or load game
    const { state: gotState, loaded } = generateNewGameState(
      initialState,
      undefined,
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
      resetTimer(gotState.elapsedTime, false);
    }

    // dispatch it to reducer
    dispatch({
      type: 'set_state',
      state: gotState,
    });

    const { gameNum } = gotState;
    if (!loaded && gameNum !== undefined) {
      // if a new game was generated, save it to db
      GameResult.getByGameNum(gameNum)
        .then((gameResult) => {
          const newGameResult = new GameResult(
            gameNum,
            0,
            0,
            GameResultStatus.NOT_COMPLETED,
            gameResult?.id ? gameResult.id : undefined,
          );
          return newGameResult.save();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [resetTimer]);

  const canUndo = useMemo(() => state.history && state.history.length > 1, [state.history]);

  /* game has been won when all cards in foundation are kings */
  const hasWon = useMemo(() => checkIfWon(state.foundationCards), [state.foundationCards]);

  useEffect(() => {
    if (!canStartTimer) {
      return;
    }
    if (state.paused) {
      pauseTimer();
      return;
    }
    startTimer();
  }, [canStartTimer, pauseTimer, startTimer, state.paused]);

  useEffect(() => {
    dispatch({
      type: 'update_elapsed_time',
      elapsedTime,
    });
  }, [elapsedTime]);

  useEffect(() => {
    if (state.loading) {
      return;
    }
    // save state on any change
    storeGameState(state);
  }, [state]);

  useEffect(() => {
    if (state.history.length === 0) {
      return;
    }
    dispatch({
      type: 'move',
    });
  }, [state.history]);

  useEffect(() => {
    if (!hasWon) {
      return;
    }
    dispatch({
      type: 'pause',
      paused: true,
    });
    const updateResult = async () => {
      const { gameNum } = state;
      if (gameNum === undefined) {
        return;
      }
      let gameResult = <GameResult> await GameResult.getByGameNum(gameNum);
      if (gameResult && gameResult.status === GameResultStatus.WON) {
        // already updated
        return;
      }
      if (!gameResult) {
        gameResult = new GameResult(
          gameNum,
          state.elapsedTime,
          state.moveCount,
          GameResultStatus.WON,
        );
      } else {
        gameResult.elapsedTime = state.elapsedTime;
        gameResult.moveCount = state.moveCount;
        gameResult.status = GameResultStatus.WON;
      }
      await gameResult.save();
    };
    updateResult().catch((err) => console.error(err));
  }, [hasWon, state]);

  const reset = useCallback(() => {
    resetTimer();
    dispatch({
      type: 'reset',
    });
  }, [resetTimer]);

  const newGame = useCallback(() => {
    const { state: gotState } = generateNewGameState(initialState);
    // set its loading to false
    gotState.loading = false;
    // dispatch it to reducer
    dispatch({
      type: 'set_state',
      state: gotState,
    });

    const { gameNum } = gotState;
    if (gameNum !== undefined) {
      GameResult.getByGameNum(gameNum)
        .then((gameResult) => {
          const newGameResult = new GameResult(
            gameNum,
            0,
            0,
            GameResultStatus.NOT_COMPLETED,
            gameResult?.id ? gameResult.id : undefined,
          );
          return newGameResult.save();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const undo = useCallback(() => {
    dispatch({
      type: 'undo',
    });
  }, []);

  const togglePause = useCallback(() => {
    dispatch({
      type: 'pause',
      paused: !state.paused,
    });
  }, [state.paused]);

  const onOpenCellClick = useCallback((cellIndex: number) => {
    dispatch({
      type: 'open_cell_click',
      cellIndex,
    });
  }, []);

  const onCascadeClick = useCallback((cascadeIndex: number) => {
    dispatch({
      type: 'cascade_click',
      cascadeIndex,
    });
  }, []);

  const setCanStartTimerWrapper = useCallback((canStart: boolean) => {
    // if canStartTimer is already true, do not update it
    if (canStartTimer) {
      return;
    }
    setCanStartTimer(canStart);
  }, [canStartTimer]);

  return [
    state,
    canUndo,
    hasWon,
    togglePause,
    reset,
    newGame,
    undo,
    onOpenCellClick,
    onCascadeClick,
    setCanStartTimerWrapper,
  ];
}
