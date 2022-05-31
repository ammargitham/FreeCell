import {
  useReducer, useCallback, useEffect, useMemo, useState, Reducer,
} from 'react';
import { isNil } from 'lodash';

import { generateNewGameState, checkIfWon } from './helper';
import GameResult from '../db/GameResult';
import { GameResultStatus } from '../db/FreeCellDatabase';
import reducer, { initialState } from './reducer';
import { Action, GameState } from './types';

export default function useFreeCellGame() : [
  GameState,
  boolean,
  boolean,
  () => void,
  () => void,
  () => void,
  (cellIndex: number) => void,
  (cellIndex: number) => void,
  React.Dispatch<React.SetStateAction<boolean>>,
] {
  const [state, dispatch] = useReducer<Reducer<GameState, Action>>(reducer, initialState);
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
    }

    // dispatch it to reducer
    dispatch({
      type: 'set_state',
      state: gotState,
    });

    if (!loaded) {
      // if a new game was generated, save it to db
      GameResult.getByGameNum(gotState.gameNum)
        .then((gameResult) => {
          const newGameResult = new GameResult(
            gotState.gameNum,
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

  const canUndo = useMemo(() => state.history && state.history.length > 1, [state.history]);

  /* game has been won when all cards in foundation are kings */
  const hasWon = useMemo(() => checkIfWon(state.foundationCards), [state.foundationCards]);

  useEffect(() => {
    if (state.loading) {
      return;
    }
    // save state on any change
    // storeGameState(state);
  }, [state]);

  useEffect(() => {
    if (isNil(state.history)) {
      return;
    }
    dispatch({
      type: 'move',
    });
  }, [state.history]);

  const reset = useCallback(() => {
    dispatch({
      type: 'reset',
    });
  }, []);

  const newGame = useCallback(() => {
    const { state: gotState } = generateNewGameState(initialState);
    // set its loading to false
    gotState.loading = false;
    // dispatch it to reducer
    dispatch({
      type: 'set_state',
      state: gotState,
    });

    GameResult.getByGameNum(gotState.gameNum)
      .then((gameResult) => {
        const newGameResult = new GameResult(
          gotState.gameNum,
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
  }, []);

  useEffect(() => {
    // if (!hasWon) {
    // }
    // dispatch({
    //   type: actions.setPaused,
    //   paused: true,
    // });
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
      type: 'undo',
    });
  }, []);

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
}
