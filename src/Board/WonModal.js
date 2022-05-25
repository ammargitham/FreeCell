import { Modal } from "../Modal";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  & .header {
    color: white;
    font-size: 1.8rem;
    font-weight: bold;
    text-shadow: 0px 1px 0px #000000;
  }

  & .actions {
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    justify-content: center;
  }
`;

export const WonModal = ({ open, onNewGameClick }) => {
  return (
    <Modal open={open}>
      <Container>
        <span className="header">Game won!</span>
        <div className="actions">
          <button className="btn actionBtn" onClick={onNewGameClick}>
            New Game
          </button>
        </div>
      </Container>
    </Modal>
  );
};
