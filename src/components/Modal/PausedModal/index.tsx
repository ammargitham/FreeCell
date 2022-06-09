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
    z-index: 1000;
  }
`;

type PausedModalContentProps = {
  onResumeClick?: () => void,
};

export function PausedModalContent({ onResumeClick }: PausedModalContentProps) {
  return (
    <Container>
      <span className="header">Game paused</span>
      <div className="actions">
        <Button
          onClick={onResumeClick}
        >
          <i
            className="icon resume"
            title="Resume"
          />
          Resume
        </Button>
      </div>
    </Container>
  );
}

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
      <PausedModalContent
        onResumeClick={onResumeClick}
      />
    </Modal>
  );
}
