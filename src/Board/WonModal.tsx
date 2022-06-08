import styled from 'styled-components';
import Modal from '../components/Modal';

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

type WonModalProps = {
  open?: boolean,
  onNewGameClick?: () => void,
};

export default function WonModal({ open, onNewGameClick }: WonModalProps) {
  return (
    <Modal open={open}>
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
    </Modal>
  );
}
