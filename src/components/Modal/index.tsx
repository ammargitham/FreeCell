import styled from 'styled-components';

import './styles.scss';

type StyledModalWindowProps = {
  $alpha?: number,
};

const StyledModalWindow = styled.div<StyledModalWindowProps>`
  background-color: rgba(0, 0, 0, ${(props) => (props.$alpha ? props.$alpha : 0.8)});
`;

type ModalProps = {
  open?: boolean,
  overlayAlpha?: number,
  children?: React.ReactNode,
};

export default function Modal({ open = false, overlayAlpha, children }: ModalProps) {
  return (
    <StyledModalWindow
      className={`modal-window ${open ? 'open' : ''}`}
      $alpha={overlayAlpha}
    >
      <div>{children}</div>
    </StyledModalWindow>
  );
}
