import { useEffect, useRef } from 'react';

import Board from './Board';
import useFreeCellGame from './game';
import './styles.scss';
import useOnLoadImages from './utils/useOnLoadImages';

export default function App() {
  const [
    state,
    canUndo,
    hasWon,
    reset,
    newGame,
    undo,
    onOpenCellClick,
    onCascadeClick,
    setCanStartTimer,
  ] = useFreeCellGame();

  const appRef = useRef<HTMLDivElement>(null);
  const imagesLoaded = useOnLoadImages(appRef);

  useEffect(() => {
    setCanStartTimer(imagesLoaded);
  }, [imagesLoaded, setCanStartTimer]);

  return (
    <div
      className="App"
      ref={appRef}
    >
      <Board
        board={{
          canUndo,
          hasWon,
          cascades: state.cascades,
          openCards: state.openCards,
          activeCard: state.activeCard,
          foundationCards: state.foundationCards,
          moveCount: state.moveCount,
          elapsedTime: state.elapsedTime,
        }}
        loading={state.loading || !imagesLoaded}
        onOpenCellClick={onOpenCellClick}
        onUndoClick={undo}
        onNewGameClick={newGame}
        onResetClick={reset}
        onCascadeClick={onCascadeClick}
      />
    </div>
  );
}
