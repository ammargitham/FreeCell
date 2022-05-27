import styled from "styled-components";
import formatSeconds from "../utils/formatSeconds";

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

export const Actions = ({
  canUndo,
  moveCount,
  elapsedTime,
  onUndoClick,
  onNewGameClick,
  onResetClick,
}) => {
  return (
    <Container>
      <ButtonsContainer>
        <button className="btn actionBtn" disabled>
          <i className="icon pause" alt="Pause" />
          <span>Pause</span>
        </button>
        <button
          className="btn actionBtn"
          disabled={!canUndo}
          onClick={onUndoClick}
        >
          <i className="icon undo" alt="Pause" />
          Undo
        </button>
        <button className="btn actionBtn" onClick={onResetClick}>
          <i className="icon reset" alt="Pause" />
          Reset
        </button>
        <button className="btn actionBtn" onClick={onNewGameClick}>
          New Game
        </button>
      </ButtonsContainer>
      <span>Moves: {moveCount}</span>
      <span>Time: {formatSeconds(elapsedTime)}</span>
    </Container>
  );
};
