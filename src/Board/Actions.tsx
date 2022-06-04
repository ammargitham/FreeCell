import styled from 'styled-components';
import formatSeconds from '../utils/formatSeconds';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
  /* width: 100%; */
  /* height: 5rem; */
  /* border-top: 1px solid black; */
`;

const ButtonsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;

  & > .btn:not(:first-child) {
    margin-left: 1rem;
  }
`;

type ActionsProps = {
  canUndo: boolean,
  isPaused: boolean,
  moveCount: number,
  elapsedTime: number,
  onPauseClick?: () => void,
  onUndoClick?: () => void,
  onNewGameClick?: () => void,
  onResetClick?: () => void,
};

export default function Actions({
  canUndo,
  isPaused,
  moveCount,
  elapsedTime,
  onPauseClick,
  onUndoClick,
  onNewGameClick,
  onResetClick,
}: ActionsProps) {
  return (
    <Container>
      <ButtonsContainer>
        <button
          type="button"
          className="btn actionBtn"
          onClick={onPauseClick}
        >
          <i
            className={`icon ${isPaused ? 'resume' : 'pause'}`}
            title={`${isPaused ? 'Resume' : 'Pause'}`}
          />
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
        <button
          type="button"
          className="btn actionBtn"
          disabled={!canUndo}
          onClick={onUndoClick}
        >
          <i className="icon undo" title="Undo" />
          Undo
        </button>
        <button type="button" className="btn actionBtn" onClick={onResetClick}>
          <i className="icon reset" title="Reset" />
          Reset
        </button>
        <button type="button" className="btn actionBtn" onClick={onNewGameClick}>
          New Game
        </button>
      </ButtonsContainer>
      <span>
        Moves:
        {moveCount}
      </span>
      <span>
        Time:
        {formatSeconds(elapsedTime)}
      </span>
    </Container>
  );
}
