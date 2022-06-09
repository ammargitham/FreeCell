import styled from 'styled-components';
import formatSeconds from '../../utils/formatSeconds';
import Button from '../Button';

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
        <Button
          onClick={onPauseClick}
        >
          <i
            className={`icon ${isPaused ? 'resume' : 'pause'}`}
            title={`${isPaused ? 'Resume' : 'Pause'}`}
          />
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </Button>
        <Button
          disabled={!canUndo}
          onClick={onUndoClick}
        >
          <i className="icon undo" title="Undo" />
          Undo
        </Button>
        <Button
          onClick={onResetClick}
        >
          <i className="icon reset" title="Reset" />
          Reset
        </Button>
        <Button
          onClick={onNewGameClick}
        >
          New Game
        </Button>
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
