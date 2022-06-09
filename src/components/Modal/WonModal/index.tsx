import styled from 'styled-components';
import Modal from '..';
import Button from '../../Button';

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
        <Button
          onClick={onNewGameClick}
        >
          New Game
        </Button>
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
