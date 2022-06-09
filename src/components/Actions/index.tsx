import styled from 'styled-components';
import formatSeconds from '../../utils/formatSeconds';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
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

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  text-shadow: 0px 1px 0px #000000;

  & > *:not(:first-child) {
    margin-left: 1rem;
  }

  & span.label {
    margin-right: 0.2rem;
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
      <InfoContainer>
        <span>
          <span className="label">Time:</span>
          {formatSeconds(elapsedTime)}
        </span>
        <span>
          <span className="label">Moves:</span>
          {moveCount || 0}
        </span>
      </InfoContainer>
    </Container>
  );
}
