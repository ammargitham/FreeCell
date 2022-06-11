import styled from 'styled-components';

import { indexToCard } from '../../game/helper';
import DraggableCard from '../Card/DraggableCard';

type ContainerProps = {
  $width: number,
  $isEmpty: boolean,
};

const Container = styled.div<ContainerProps>`
  position: relative;
  width: ${(props) => props.$width}px;
  aspect-ratio: ${(props) => (props.$isEmpty ? '135 / 197' : null)};
  cursor: ${(props) => (props.onClick ? 'pointer' : null)};

  &:before {
    position: absolute;
    content: '';
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: 1px solid black;
    border-radius: 0.5rem;
    pointer-events: none;
  }
`;

type CardCellProps = {
  card?: number,
  className?: string,
  isActive?: boolean,
  width: number,
  isDraggable?: boolean,
  showPreview?: boolean,
  onClick?: () => void,
};

export default function CardCell({
  card,
  className,
  isActive,
  width,
  isDraggable,
  showPreview,
  onClick,
}: CardCellProps) {
  let c;
  if (card !== undefined) {
    c = indexToCard(card);
  }
  return (
    <Container
      className={className}
      $width={width}
      $isEmpty={!c}
      onClick={c === undefined ? onClick : undefined}
    >
      {c !== undefined && (
      <DraggableCard
        className={`${isActive && 'active'}`}
        card={c}
        width={width}
        isDraggable={isDraggable}
        showPreview={showPreview}
        // hideBorder
        onClick={onClick}
      />
      )}
    </Container>
  );
}
