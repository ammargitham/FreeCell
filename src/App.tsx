import { useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Board from './Board';
import useFreeCellGame from './game';
import './styles.scss';
import useOnLoadImages from './utils/useOnLoadImages';

export default function App() {
  const [
    state,
    canUndo,
    hasWon,
    togglePause,
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
      <DndProvider backend={HTML5Backend}>
        <Board
          board={{
            canUndo,
            hasWon,
            isPaused: state.paused,
            cascades: state.cascades,
            openCards: state.openCards,
            activeCard: state.activeCard,
            foundationCards: state.foundationCards,
            moveCount: state.moveCount,
            elapsedTime: state.elapsedTime,
          }}
          loading={state.loading || !imagesLoaded}
          onOpenCellClick={onOpenCellClick}
          onPauseClick={togglePause}
          onUndoClick={undo}
          onNewGameClick={newGame}
          onResetClick={reset}
          onCascadeClick={onCascadeClick}
        />
      </DndProvider>
    </div>
  );
}
