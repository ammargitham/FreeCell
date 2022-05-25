import { useRef } from "react";

import Board from "./Board";
import useFreeCellGame from "./game";
import "./styles.scss";
import { useOnLoadImages } from "./utils/useOnLoadImages";

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
  ] = useFreeCellGame();

  const appRef = useRef();
  const imagesLoaded = useOnLoadImages(appRef);

  return (
    <div className="App" ref={appRef}>
      <Board
        board={{
          canUndo,
          hasWon,
          cascades: state.cascades,
          openCards: state.openCards,
          activeCard: state.activeCard,
          foundationCards: state.foundationCards,
          moveCount: state.moveCount,
        }}
        loading={!imagesLoaded}
        onOpenCellClick={onOpenCellClick}
        onUndoClick={undo}
        onNewGameClick={newGame}
        onResetClick={reset}
        onCascadeClick={onCascadeClick}
      />
    </div>
  );
}
