import styled from 'styled-components';
import Modal from '..';

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

type WonModalContentProps = {
  onNewGameClick?: () => void,
};

export function WonModalContent({ onNewGameClick }: WonModalContentProps) {
  return (
    <Container>
      <span className="header">Game won!</span>
      <div className="actions">
        <button
          type="button"
          className="btn actionBtn"
          onClick={onNewGameClick}
        >
          New Game
        </button>
      </div>
    </Container>
  );
}

type WonModalProps = {
  open?: boolean,
  onNewGameClick?: () => void,
};

export default function WonModal({ open, onNewGameClick }: WonModalProps) {
  return (
    <Modal open={open}>
      <WonModalContent
        onNewGameClick={onNewGameClick}
      />
    </Modal>
  );
}
