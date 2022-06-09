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
    z-index: 1000;
  }
`;

type PausedModalProps = {
  open?: boolean,
  onResumeClick?: () => void,
};

export default function PausedModal({ open, onResumeClick }: PausedModalProps) {
  return (
    <Modal
      open={open}
      overlayAlpha={0.98}
    >
      <Container>
        <span className="header">Game paused</span>
        <div className="actions">
          <button
            type="button"
            className="btn actionBtn"
            onClick={onResumeClick}
          >
            <i
              className="icon resume"
              title="Resume"
            />
            Resume
          </button>
        </div>
      </Container>
    </Modal>
  );
}
